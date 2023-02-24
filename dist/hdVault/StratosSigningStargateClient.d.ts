import { StdFee } from '@cosmjs/amino';
import { ExtendedSecp256k1Signature } from '@cosmjs/crypto';
import { EncodeObject, // OfflineSigner,
OfflineDirectSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient, SignerData, // AccountParser,
SigningStargateClientOptions } from '@cosmjs/stargate';
import { HttpEndpoint, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { ServiceClientImpl } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { wallet } from '../hdVault';
import * as evm from '../transactions/evm';
export declare class StratosSigningStargateClient extends SigningStargateClient {
    protected readonly mySigner: OfflineDirectSigner;
    static connectWithSigner(endpoint: string | HttpEndpoint, signer: OfflineDirectSigner, options?: SigningStargateClientOptions): Promise<StratosSigningStargateClient>;
    protected constructor(tmClient: Tendermint34Client | undefined, signer: OfflineDirectSigner, options: SigningStargateClientOptions);
    getQueryService(): ServiceClientImpl | undefined;
    ecdsaSignatures(raw: any, keyPair: wallet.KeyPairInfo, prefix?: number): Promise<ExtendedSecp256k1Signature>;
    private simulateEvm;
    sign(signerAddress: string, messages: readonly EncodeObject[], fee: StdFee, memo: string, explicitSignerData?: SignerData, extensionOptions?: Any[]): Promise<TxRaw>;
    execEvm(payload: evm.DynamicFeeTx, keyPair: wallet.KeyPairInfo, simulate: boolean): Promise<TxRaw | number>;
    signForEvm(payload: evm.DynamicFeeTx, keyPair: wallet.KeyPairInfo): Promise<TxRaw>;
    private getEthSecpStratosEncodedPubkey;
    private getCosmosEncodedPubkey;
    private signDirectStratos;
}
