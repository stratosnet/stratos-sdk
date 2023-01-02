import { encodeSecp256k1Pubkey, StdFee } from '@cosmjs/amino';
import { fromBase64, toBase64 } from '@cosmjs/encoding';
import { Int53 } from '@cosmjs/math';
import {
  EncodeObject,
  encodePubkey,
  makeAuthInfoBytes,
  makeSignDoc,
  OfflineSigner,
  TxBodyEncodeObject,
} from '@cosmjs/proto-signing';
import { SigningStargateClient, SignerData, SigningStargateClientOptions } from '@cosmjs/stargate';
import { HttpEndpoint, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import * as stratosTypes from '@stratos-network/stratos-cosmosjs-types';
import { PubKey as CosmosCryptoSecp256k1Pubkey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
// import { PubKey as CosmosCryptoEd25519Pubkey } from 'cosmjs-types/cosmos/crypto/ed25519/keys';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';

export class StratosSigningStargateClient extends SigningStargateClient {
  protected readonly mySigner: OfflineSigner;

  public static async connectWithSigner(
    endpoint: string | HttpEndpoint,
    signer: OfflineSigner,
    options: SigningStargateClientOptions = {},
  ): Promise<StratosSigningStargateClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new StratosSigningStargateClient(tmClient, signer, options);
  }

  protected constructor(
    tmClient: Tendermint34Client | undefined,
    signer: OfflineSigner,
    options: SigningStargateClientOptions,
  ) {
    super(tmClient, signer, options);
    // const { registry = createDefaultRegistry(), aminoTypes = new AminoTypes(createDefaultTypes()) } = options;
    // this.registry = registry;
    // this.aminoTypes = aminoTypes;
    this.mySigner = signer;
    // this.broadcastTimeoutMs = options.broadcastTimeoutMs;
    // this.broadcastPollIntervalMs = options.broadcastPollIntervalMs;
    // this.gasPrice = options.gasPrice;
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

    console.log('YES sign from signing stargate client (next will be sign direct)');
    return this.signDirectStratos(signerAddress, messages, fee, memo, signerData);
  }

  private async signDirectStratos(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData,
  ): Promise<TxRaw> {
    // assert(isOfflineDirectSigner(this.signer));

    const accountFromSigner = (await this.mySigner.getAccounts()).find(
      account => account.address === signerAddress,
    );
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer');
    }
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(accountFromSigner.pubkey));

    console.log('YES pubkey from sign direct of stragate sign accountFromSigner ', accountFromSigner.pubkey);
    console.log('YES pubkey from sign direct of stragate sign ', pubkey);
    // typeUrl: '/cosmos.crypto.secp256k1.PubKey',
    // pubkey.typeUrl = '/stratos.crypto.v1.ethsecp256k1.PubKey';

    const StratosPubKey = stratosTypes.stratos.crypto.v1.ethsecp256k1.PubKey;

    const pubkey2Value = toBase64(accountFromSigner.pubkey);

    const pubkeyProto = CosmosCryptoSecp256k1Pubkey.fromPartial({
      key: fromBase64(pubkey2Value),
    });

    const encodedPubKey2 = Any.fromPartial({
      // typeUrl: '/cosmos.crypto.secp256k1.PubKey',
      typeUrl: '/stratos.crypto.v1.ethsecp256k1.PubKey',
      value: Uint8Array.from(StratosPubKey.encode(pubkeyProto).finish()),
    });

    console.log('YES pubkey2 from sign direct of stragate sign ', encodedPubKey2);

    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages: messages,
        memo: memo,
      },
    };

    const txBodyBytes = this.registry.encode(txBodyEncodeObject);
    const gasLimit = Int53.fromString(fee.gas).toNumber();
    const authInfoBytes = makeAuthInfoBytes(
      // [{ pubkey, sequence }],
      [{ pubkey: encodedPubKey2, sequence }],
      fee.amount,
      gasLimit,
      fee.granter,
      fee.payer,
    );
    const signDoc = makeSignDoc(txBodyBytes, authInfoBytes, chainId, accountNumber);
    const { signature, signed } = await this.mySigner.signDirect(signerAddress, signDoc);
    return TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    });
  }
}
