import { encodeSecp256k1Pubkey, StdFee } from '@cosmjs/amino';
import { fromBase64, toBase64 } from '@cosmjs/encoding';
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

// eslint-disable-next-line @typescript-eslint/naming-convention
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

    return this.signDirectStratos(signerAddress, messages, fee, memo, signerData);
  }

  public async getEthSecpStratosEncodedPubkey(signerAddress: string): Promise<Any> {
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

  public async getCosmosEncodedPubkey(signerAddress: string): Promise<Any> {
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

  public async signDirectStratos(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
  ): Promise<TxRaw> {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const pubkeyEncodedStratos = await this.getEthSecpStratosEncodedPubkey(signerAddress);
    const pubkeyEncodedToUse = pubkeyEncodedStratos;

    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages: messages,
        memo: memo,
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
