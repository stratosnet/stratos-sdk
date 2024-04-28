import { encodeSecp256k1Pubkey, StdFee } from '@cosmjs/amino';
import { ExtendedSecp256k1Signature, Secp256k1 } from '@cosmjs/crypto';
import { fromBase64, toBase64, fromHex } from '@cosmjs/encoding';
import { Int53, Uint53 } from '@cosmjs/math';
import {
  EncodeObject,
  encodePubkey,
  makeAuthInfoBytes,
  makeSignDoc,
  TxBodyEncodeObject,
  OfflineSigner,
  isOfflineDirectSigner,
} from '@cosmjs/proto-signing';
import { SigningStargateClient, SignerData, SigningStargateClientOptions } from '@cosmjs/stargate';
import { createProtobufRpcClient } from '@cosmjs/stargate/build/queryclient';
import { HttpEndpoint, TendermintClient } from '@cosmjs/tendermint-rpc';
import { assert } from '@cosmjs/utils';
import * as stratosTypes from '@stratos-network/stratos-cosmosjs-types';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { SimulateRequest, ServiceClientImpl } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { TxRaw, AuthInfo, Fee, Tx, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { ethers } from 'ethers';
import { evmTransactions as evm } from '../../chain/evm';
import { minGasPrice } from '../../config/tokens';
import * as WalletTypes from '../hdVault/hdVaultTypes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const tendermint_rpc_1 = require('@cosmjs/tendermint-rpc');

const StratosPubKey = stratosTypes.stratos.crypto.v1.ethsecp256k1.PubKey;

export class StratosSigningStargateClient extends SigningStargateClient {
  protected readonly mySigner: OfflineSigner;

  public static async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: OfflineSigner,
    options: SigningStargateClientOptions = {},
  ): Promise<StratosSigningStargateClient> {
    // Tendermint/CometBFT 0.34/0.37 auto-detection. Starting with 0.37 we seem to get reliable versions again 🎉
    // Using 0.34 as the fallback.
    let tmClient: TendermintClient;
    // const tm37Client = await Tendermint37Client.connect(endpoint);
    const tm37Client = await tendermint_rpc_1.Tendermint37Client.connect(endpoint);
    const version = (await tm37Client.status()).nodeInfo.version;
    if (version.startsWith('0.37.')) {
      tmClient = tm37Client;
    } else {
      tm37Client.disconnect();
      // tmClient = await Tendermint34Client.connect(endpoint);
      tmClient = await tendermint_rpc_1.Tendermint34Client.connect(endpoint);
    }

    return StratosSigningStargateClient.createWithSigner(tmClient, signer, options);
  }

  /**
   * Creates an instance from a manually created Tendermint client.
   * Use this to use `Tendermint37Client` instead of `Tendermint34Client`.
   */
  public static async createWithSigner(
    // tmClient: TendermintClient,
    tmClient: typeof tendermint_rpc_1.TendermintClient,
    signer: OfflineSigner,
    options: SigningStargateClientOptions = {},
  ): Promise<StratosSigningStargateClient> {
    return new StratosSigningStargateClient(tmClient, signer, options);
  }

  protected constructor(
    // tmClient: TendermintClient | undefined,
    tmClient: typeof tendermint_rpc_1.TendermintClient | undefined,
    signer: OfflineSigner,
    options: SigningStargateClientOptions,
  ) {
    super(tmClient, signer, options);

    this.mySigner = signer;

    // const {
    // registry = new Registry(defaultRegistryTypes),
    // aminoTypes = new AminoTypes(createDefaultAminoConverters()),
    // } = options;
    // this.registry = registry;
    // this.aminoTypes = aminoTypes;
    // this.signer = signer;
    // this.broadcastTimeoutMs = options.broadcastTimeoutMs;
    // this.broadcastPollIntervalMs = options.broadcastPollIntervalMs;
    // this.gasPrice = options.gasPrice;
  }

  public getQueryService(): ServiceClientImpl | undefined {
    const queryClient = this.getQueryClient();
    if (!queryClient) return;
    const rpc = createProtobufRpcClient(queryClient);
    return new ServiceClientImpl(rpc);
  }

  public async ecdsaSignatures(
    raw: any,
    keyPair: WalletTypes.KeyPairInfo,
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

  public async encodeMessagesFromTheTxBody(messages: any[] | undefined) {
    if (!messages) {
      return null;
    }

    const parsedData = [];

    for (const message of messages) {
      const encodedMessage = this.registry.encode({ typeUrl: message.typeUrl, value: message.value });

      parsedData.push({ typeUrl: message.typeUrl, value: toBase64(encodedMessage) });
    }

    return parsedData;
  }

  public async decodeMessagesFromTheTxBody(messages: any[] | undefined) {
    if (!messages) {
      return null;
    }
    const parsedData = [];

    for (const message of messages) {
      const decodedMessage = this.registry.decode(message);

      parsedData.push({ typeUrl: message.typeUrl, value: decodedMessage });
    }

    return parsedData;
  }

  public async execEvm(
    payload: evm.DynamicFeeTx,
    keyPair: WalletTypes.KeyPairInfo,
    simulate: boolean,
  ): Promise<TxRaw | number> {
    const chainId = +(payload.chainId || '0'); // NOTE: Should be retrieved from API but currently only available on web3 api
    const nonce = payload.nonce || (await this.getSequence(keyPair.address)).sequence;
    const gasTipCap = ethers.BigNumber.from(payload.gasTipCap || '0'); // NOTE: Useless but keeped for a london sync
    const gasFeeCap = ethers.BigNumber.from(payload.gasFeeCap || minGasPrice.toString());
    const to = payload.to || '0x';
    const value = ethers.BigNumber.from(payload.value || 0);
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

    // const authInfoBytes = makeAuthInfoBytes([], fee.amount, +fee.gas);

    const authInfoBytes = makeAuthInfoBytes([], fee.amount, +fee.gas, fee.granter, fee.payer);

    return TxRaw.fromPartial({
      bodyBytes,
      authInfoBytes,
    });
  }

  public async signForEvm(payload: evm.DynamicFeeTx, keyPair: WalletTypes.KeyPairInfo): Promise<TxRaw> {
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
    assert(isOfflineDirectSigner(this.mySigner));

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

    // const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubkeyEncodedToUse, sequence }], fee.amount, gasLimit);

    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey: pubkeyEncodedToUse, sequence }],
      fee.amount,
      gasLimit,
      fee.granter,
      fee.payer,
    );

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
