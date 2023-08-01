import { encodeSecp256k1Pubkey, StdFee } from '@cosmjs/amino';
import { ExtendedSecp256k1Signature, Secp256k1 } from '@cosmjs/crypto';
import { fromBase64, toBase64, fromHex } from '@cosmjs/encoding';
import { Int53, Uint53 } from '@cosmjs/math';
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
import { createProtobufRpcClient } from '@cosmjs/stargate/build/queryclient';
import { HttpEndpoint, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import * as stratosTypes from '@stratos-network/stratos-cosmosjs-types';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { SimulateRequest, ServiceClientImpl } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { TxRaw, AuthInfo, Fee, Tx, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { ethers } from 'ethers';
import { minGasPrice } from '../config/tokens';
import { wallet } from '../hdVault';
import * as evm from '../transactions/evm';

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

  public getQueryService(): ServiceClientImpl | undefined {
    const queryClient = this.getQueryClient();
    if (!queryClient) return;
    const rpc = createProtobufRpcClient(queryClient);
    return new ServiceClientImpl(rpc);
  }

  public async ecdsaSignatures(
    raw: any,
    keyPair: wallet.KeyPairInfo,
    prefix?: number,
  ): Promise<ExtendedSecp256k1Signature> {
    let rawTransaction = ethers.utils.RLP.encode(raw);
    if (prefix) {
      const rawBuffer = Buffer.concat([
        Buffer.from(prefix.toString(16).padStart(2, '0'), 'hex'),
        Buffer.from(ethers.utils.arrayify(rawTransaction)),
      ]);
      rawTransaction = ethers.utils.hexlify(rawBuffer);
    }
    const hash = ethers.utils.keccak256(rawTransaction);
    return await Secp256k1.createSignature(ethers.utils.arrayify(hash), fromHex(keyPair.privateKey));
  }

  private async simulateEvm(payload: evm.DynamicFeeTx, fee: StdFee): Promise<number> {
    const messages = evm.getEvmMsgs(payload).map(m => this.registry.encodeAsAny(m));
    const tx = Tx.fromPartial({
      authInfo: AuthInfo.fromPartial({
        fee: Fee.fromPartial({ amount: fee.amount as Coin[], gasLimit: fee.gas }),
        signerInfos: [],
      }),
      body: TxBody.fromPartial({
        messages: Array.from(messages),
        extensionOptions: evm.evmExtensionOptions,
      }),
      signatures: [],
    });
    const request = SimulateRequest.fromPartial({
      txBytes: Tx.encode(tx).finish(),
    });
    const response = await this.getQueryService()?.Simulate(request);
    const gasUsed = response?.gasInfo?.gasUsed?.toString() || '21000';
    return Uint53.fromString(gasUsed).toNumber();
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

    const directlySignedByStratos = this.signDirectStratos(
      signerAddress,
      messages,
      fee,
      memo,
      signerData,
      extensionOptions,
    );

    return directlySignedByStratos;
  }

  public async execEvm(
    payload: evm.DynamicFeeTx,
    keyPair: wallet.KeyPairInfo,
    simulate: boolean,
  ): Promise<TxRaw | number> {
    const chainId = +(payload.chainId || '0'); // NOTE: Should be retrieved from API but currently only available on web3 api
    const nonce = payload.nonce || (await this.getSequence(keyPair.address)).sequence;
    const gasTipCap = ethers.utils.bigNumberify(payload.gasTipCap || '0'); // NOTE: Useless but keeped for a london sync
    const gasFeeCap = ethers.utils.bigNumberify(payload.gasFeeCap || minGasPrice.toString());
    const to = payload.to || '0x';
    const value = ethers.utils.bigNumberify(payload.value || 0);
    const data = payload.data;
    const accesses = payload.accesses; // NOTE: Not supported on stratos yet, but required for signing
    const gas = simulate ? evm.maxGas : payload.gas || 0;
    // NOTE: Ordered as set
    const transaction: any = {
      chainId,
      nonce,
      gasTipCap,
      gasFeeCap,
      gas,
      to,
      value,
      data,
      accesses,
    };

    const raw: any = [];
    evm.evmTransactionFields.forEach(fieldInfo => {
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
      if (fieldInfo.asStruct && v.length === 0) {
        raw.push([]); // for rlp struct{}{}
        return;
      }
      raw.push(ethers.utils.hexlify(v));
    });

    const signature = await this.ecdsaSignatures(raw, keyPair, evm.TxTypes.Eip1559);
    const signedPayload = evm.DynamicFeeTx.fromPartial({
      chainId: chainId.toString(),
      nonce,
      gasTipCap: gasTipCap.toString(),
      gasFeeCap: gasFeeCap.toString(),
      gas,
      to,
      value: value.toString(),
      data,
      accesses,
      v: Uint8Array.from([signature.recovery]),
      r: signature.r(32),
      s: signature.s(32),
    });

    const fee: StdFee = {
      amount: [{ amount: gasFeeCap.add(gasTipCap).mul(signedPayload.gas).toString(), denom: 'wei' }],
      gas: `${signedPayload.gas}`,
    };

    if (simulate) {
      return await this.simulateEvm(signedPayload, fee);
    }

    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages: evm.getEvmMsgs(signedPayload),
        extensionOptions: evm.evmExtensionOptions,
      },
    };
    const bodyBytes = this.registry.encode(txBodyEncodeObject);
    const authInfoBytes = makeAuthInfoBytes([], fee.amount, +fee.gas);
    return TxRaw.fromPartial({
      bodyBytes,
      authInfoBytes,
    });
  }

  public async signForEvm(payload: evm.DynamicFeeTx, keyPair: wallet.KeyPairInfo): Promise<TxRaw> {
    payload.gas = payload.gas || ((await this.execEvm(payload, keyPair, true)) as number);
    return (await this.execEvm(payload, keyPair, false)) as TxRaw;
  }

  private async getEthSecpStratosEncodedPubkey(signerAddress: string): Promise<Any> {
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

  private async getCosmosEncodedPubkey(signerAddress: string): Promise<Any> {
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

    const assembledTx = TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });

    return assembledTx;
  }
}
