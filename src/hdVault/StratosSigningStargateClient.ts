import { encodeSecp256k1Pubkey, StdFee } from '@cosmjs/amino';
// import { StdFee } from '@cosmjs/amino';
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
  // accountFromAny,
  SigningStargateClientOptions,
} from '@cosmjs/stargate';
import { HttpEndpoint, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import * as stratosTypes from '@stratos-network/stratos-cosmosjs-types';
// import { PubKey as CosmosCryptoSecp256k1Pubkey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';

const StratosPubKey = stratosTypes.stratos.crypto.v1.ethsecp256k1.PubKey;

export class StratosSigningStargateClient extends SigningStargateClient {
  protected readonly mySigner: OfflineDirectSigner;

  public static async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: OfflineDirectSigner,
    options: SigningStargateClientOptions = {},
  ): Promise<StratosSigningStargateClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    console.log('stratos StratosSigningStargateClient - options', options);
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
      // console.log('aaaa11', signerAddress);
      const { accountNumber, sequence } = await this.getSequence(signerAddress);

      // console.log('aaaa2');
      const chainId = await this.getChainId();

      // console.log('aaaa3');
      signerData = {
        accountNumber: accountNumber,
        sequence: sequence,
        chainId: chainId,
      };
    }

    console.log(
      '0. YES sign from signing stargate client (next will be sign direct), signerData ',
      signerData,
    );

    return this.signDirectStratos(signerAddress, messages, fee, memo, signerData);
  }

  private async getEthSecpStratosEncodedPubkey(signerAddress: string) {
    const accountFromSigner = (await this.mySigner.getAccounts()).find(
      account => account.address === signerAddress,
    );

    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }

    // console.log('1. YES - sign direct of stragate sign - accountFromSigner pubkey', accountFromSigner.pubkey);

    const base64ofPubkey = toBase64(accountFromSigner.pubkey);

    // const ethSecp256k1Pubkey = {
    // type: 'tendermint/PubKeySecp256k1',
    // type: 'stratos/PubKeyEthSecp256k1',
    // type: '/stratos.crypto.v1.ethsecp256k1.PubKey',
    // value: toBase64(accountFromSigner.pubkey),
    // };

    // console.log(
    //   '6. YES - sign direct of stragate sign - ethSecp256k1Pubkey Stratos (value will match with secp256k1Pubkey value)',
    //   ethSecp256k1Pubkey,
    // );

    const pubkeyProto = StratosPubKey.fromObject({
      key: fromBase64(base64ofPubkey),
    });

    // console.log(
    //   '7. YES - sign direct of stragate sign - pubkeyProto (to be used in stratos key and must match to pubkeyProtoLegacy)',
    //   pubkeyProto,
    // );

    const pubkeyEncodedStratos = Any.fromPartial({
      typeUrl: '/stratos.crypto.v1.ethsecp256k1.PubKey',
      value: Uint8Array.from(StratosPubKey.encode(pubkeyProto).finish()),
    });

    // console.log(
    //   '8. YES - sign direct of stragate sign - pubkeyEncodedStratos (must have the same key but different type as pubkeyProtoLegacy and it is passed to the backend now)',
    //   pubkeyEncodedStratos,
    // );

    return pubkeyEncodedStratos;
  }

  private async getCosmosEncodedPubkey(signerAddress: string) {
    const accountFromSigner = (await this.mySigner.getAccounts()).find(
      account => account.address === signerAddress,
    );

    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }

    // console.log('1. YES - sign direct of stragate sign - accountFromSigner pubkey', accountFromSigner.pubkey);
    // const base64ofPubkey = toBase64(accountFromSigner.pubkey);

    // console.log(
    //   '2. YES - sign direct of stragate sign - base64ofPubkey (to be used to create ethSecp256k1Pubkey and secp256k1Pubkey)',
    //   base64ofPubkey,
    // );

    const secp256k1PubkeyLegacy = encodeSecp256k1Pubkey(accountFromSigner.pubkey);

    // console.log(
    //   '3. YES - sign direct of stragate sign - secp256k1PubkeyLegacy (with tendermint type)',
    //   secp256k1PubkeyLegacy,
    // );

    // const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey));

    // const pubkeyProtoLegacy = CosmosCryptoSecp256k1Pubkey.fromPartial({
    //   key: fromBase64(base64ofPubkey),
    // });

    // console.log('4. YES - sign direct of stragate sign - pubkeyProtoLegacy', pubkeyProtoLegacy);

    const pubkeyEncodedLegacy = encodePubkey(secp256k1PubkeyLegacy);

    // console.log(
    //   '5. YES - sign direct of stragate sign - pubkeyEncodedLegacy - encoded by cosmos (was used and passed to the backend before) ',
    //   pubkeyEncodedLegacy,
    // );

    return pubkeyEncodedLegacy;
  }

  private async signDirectStratos(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
  ): Promise<TxRaw> {
    const pubkeyEncodedStratos = await this.getEthSecpStratosEncodedPubkey(signerAddress);
    // const pubkeyEncodedLegacy = await this.getCosmosEncodedPubkey(signerAddress);

    // we can flip between an old and new pubkey here
    // const pubkeyEncodedToUse = pubkeyProtoLegacy
    const pubkeyEncodedToUse = pubkeyEncodedStratos;

    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages: messages,
        memo: memo,
      },
    };

    const txBodyBytes = this.registry.encode(txBodyEncodeObject);
    // console.log('txBodyBytes', txBodyBytes);
    const gasLimit = Int53.fromString(fee.gas).toNumber();
    const authInfoBytes = makeAuthInfoBytes([{ pubkey: pubkeyEncodedToUse, sequence }], fee.amount, gasLimit);
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);
    const { signature, signed } = await this.mySigner.signDirect(signerAddress, signDoc);

    // console.log('signed!', signed);
    // console.log('signed!', Uint8Array.from(signed.bodyBytes));
    // console.log('signed!', Uint8Array.from(signed.authInfoBytes));
    const verificationResult = StratosPubKey.verify(signed);
    console.log('9. YES - signature verify result (null means it is verified)', verificationResult);
    console.log('10. YES - signature  ', signature);
    return TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
  }
}
