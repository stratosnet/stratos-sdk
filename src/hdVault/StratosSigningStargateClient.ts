import { encodeSecp256k1Pubkey, StdFee } from '@cosmjs/amino';
import { Secp256k1 } from '@cosmjs/crypto';
import { fromBase64, toBase64, fromHex, toHex, fromBech32 } from '@cosmjs/encoding';
import { Int53 } from '@cosmjs/math';
import {
  EncodeObject,
  encodePubkey,
  makeAuthInfoBytes,
  makeSignDoc, // OfflineSigner,
  OfflineDirectSigner,
  TxBodyEncodeObject,
} from '@cosmjs/proto-signing';
import {
  SigningStargateClient,
  SignerData, // AccountParser,
  SigningStargateClientOptions,
} from '@cosmjs/stargate';
import { HttpEndpoint, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import * as stratosTypes from '@stratos-network/stratos-cosmosjs-types';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { ethers } from 'ethers';
import { minGasPrice } from '../config/tokens';
import { wallet } from '../hdVault';
import * as transactions from '../transactions';
import { EvmLegacyTxPayload } from '../transactions/types';
import * as transactionTypes from '../transactions/types';

const StratosPubKey = stratosTypes.stratos.crypto.v1.ethsecp256k1.PubKey;

export class StratosSigningStargateClient extends SigningStargateClient {
  protected readonly mySigner: OfflineDirectSigner;

  public static async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: OfflineDirectSigner,
    options: SigningStargateClientOptions = {},
  ): Promise<StratosSigningStargateClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new StratosSigningStargateClient(tmClient, signer, options);
  }

  protected constructor(
    tmClient: Tendermint34Client | undefined,
    signer: OfflineDirectSigner,
    options: SigningStargateClientOptions,
  ) {
    super(tmClient, signer, options);
    this.mySigner = signer;
  }

  public async sign(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    explicitSignerData?: SignerData,
    extensionOptions?: Any[],
  ): Promise<TxRaw> {
    let signerData: SignerData;

    if (explicitSignerData) {
      signerData = explicitSignerData;
    } else {
      const { accountNumber, sequence } = await this.getSequence(signerAddress);

      const chainId = await this.getChainId();

      signerData = {
        accountNumber: accountNumber,
        sequence: sequence,
        chainId: chainId,
      };
    }

    // console.log(
    //   '0. YES sign from signing stargate client (next will be sign direct), signerData ',
    //   signerData,
    // );

    return this.signDirectStratos(signerAddress, messages, fee, memo, signerData, extensionOptions);
  }

  public async signAsEvm(payload: EvmLegacyTxPayload, keyPair: wallet.KeyPairInfo): Promise<TxRaw> {
    const nonce = payload.nonce || (await this.getSequence(keyPair.address)).sequence;
    const gasPrice = ethers.utils.bigNumberify(payload.gasPrice || minGasPrice.toString());
    const gas =
      payload.gas ||
      (await this.simulate(
        keyPair.address,
        transactions.getEvmLegacyTx(keyPair.address, payload),
        undefined,
      ));
    const to = payload.to || '0x';
    const value = ethers.utils.bigNumberify(payload.value || 0);
    const data = payload.data || '0x';

    const transaction: any = {
      nonce,
      gasPrice,
      gas,
      to,
      value,
      data,
    };

    const raw: any = [];
    transactionTypes.evmTransactionFields.forEach(fieldInfo => {
      let v = transaction[fieldInfo.name] || [];
      v = ethers.utils.arrayify(ethers.utils.hexlify(v));
      // Fixed-width field
      if (fieldInfo.length && v.length !== fieldInfo.length && v.length > 0) {
        throw new Error('invalid length for ' + fieldInfo.name);
      }
      // Variable-width (with a maximum)
      if (fieldInfo.maxLength) {
        v = ethers.utils.stripZeros(v);
        if (v.length > fieldInfo.maxLength) {
          throw new Error('invalid length for ' + fieldInfo.name);
        }
      }
      raw.push(ethers.utils.hexlify(v));
    });

    const rawTransaction = ethers.utils.RLP.encode(raw);
    const hash = ethers.utils.keccak256(rawTransaction);
    const signature = await Secp256k1.createSignature(
      ethers.utils.arrayify(hash),
      fromHex(keyPair.privateKey),
    );

    payload.v = Uint8Array.from([signature.recovery + 27]);
    payload.r = signature.r(32);
    payload.s = signature.s(32);

    const fee: StdFee = {
      amount: [
        { amount: ethers.utils.bigNumberify(payload.gasPrice).mul(payload.gas).toString(), denom: 'wei' },
      ],
      gas: `${payload.gas}`,
    };

    const messages: readonly EncodeObject[] = transactions.getEvmLegacyTx(keyPair.address, payload);

    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages,
        extensionOptions: transactionTypes.evmExtensionOptions,
      },
    };
    const bodyBytes = this.registry.encode(txBodyEncodeObject);
    const authInfoBytes = makeAuthInfoBytes([], fee.amount, Int53.fromString(fee.gas).toNumber());
    return TxRaw.fromPartial({
      bodyBytes,
      authInfoBytes,
    });
  }

  private async getEthSecpStratosEncodedPubkey(signerAddress: string) {
    const accountFromSigner = (await this.mySigner.getAccounts()).find(
      account => account.address === signerAddress,
    );

    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }

    const base64ofPubkey = toBase64(accountFromSigner.pubkey);

    const pubkeyProto = StratosPubKey.fromObject({
      key: fromBase64(base64ofPubkey),
    });

    const pubkeyEncodedStratos = Any.fromPartial({
      typeUrl: '/stratos.crypto.v1.ethsecp256k1.PubKey',
      value: Uint8Array.from(StratosPubKey.encode(pubkeyProto).finish()),
    });

    return pubkeyEncodedStratos;
  }

  private async getCosmosEncodedPubkey(signerAddress: string) {
    const accountFromSigner = (await this.mySigner.getAccounts()).find(
      account => account.address === signerAddress,
    );

    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }

    const secp256k1PubkeyLegacy = encodeSecp256k1Pubkey(accountFromSigner.pubkey);

    const pubkeyEncodedLegacy = encodePubkey(secp256k1PubkeyLegacy);

    return pubkeyEncodedLegacy;
  }

  private async signDirectStratos(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
    extensionOptions?: Any[],
  ): Promise<TxRaw> {
    const pubkeyEncodedStratos = await this.getEthSecpStratosEncodedPubkey(signerAddress);
    const pubkeyEncodedToUse = pubkeyEncodedStratos;

    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages,
        memo,
        extensionOptions,
      },
    };

    const txBodyBytes = this.registry.encode(txBodyEncodeObject);
    const gasLimit = Int53.fromString(fee.gas).toNumber();
    const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubkeyEncodedToUse, sequence }], fee.amount, gasLimit);
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);
    const { signature, signed } = await this.mySigner.signDirect(signerAddress, signDoc);

    // const verificationResult = StratosPubKey.verify(signed);
    return TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
  }
}
