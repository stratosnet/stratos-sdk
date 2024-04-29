import { StdFee } from '@cosmjs/amino';
import { ExtendedSecp256k1Signature } from '@cosmjs/crypto';
import { EncodeObject, OfflineSigner } from '@cosmjs/proto-signing';
import { SignerData, SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate';
import { HttpEndpoint } from '@cosmjs/tendermint-rpc';
import { ServiceClientImpl } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { evmTransactions as evm } from '../../chain/evm';
import * as WalletTypes from '../hdVault/hdVaultTypes';
declare const tendermint_rpc_1: any;
export declare class StratosSigningStargateClient extends SigningStargateClient {
    protected readonly mySigner: OfflineSigner;
    static connectWithSigner(endpoint: string | HttpEndpoint, signer: OfflineSigner, options?: SigningStargateClientOptions): Promise<StratosSigningStargateClient>;
    /**
     * Creates an instance from a manually created Tendermint client.
     * Use this to use `Tendermint37Client` instead of `Tendermint34Client`.
     */
    static createWithSigner(tmClient: typeof tendermint_rpc_1.TendermintClient, signer: OfflineSigner, options?: SigningStargateClientOptions): Promise<StratosSigningStargateClient>;
    protected constructor(tmClient: typeof tendermint_rpc_1.TendermintClient | undefined, signer: OfflineSigner, options: SigningStargateClientOptions);
    getQueryService(): ServiceClientImpl | undefined;
    ecdsaSignatures(raw: any, keyPair: WalletTypes.KeyPairInfo, prefix?: number): Promise<ExtendedSecp256k1Signature>;
    private simulateEvm;
    sign(signerAddress: string, messages: readonly EncodeObject[], fee: StdFee, memo: string, explicitSignerData?: SignerData, extensionOptions?: Any[]): Promise<TxRaw>;
    encodeMessagesFromTheTxBody(messages: any[] | undefined): Promise<{
        typeUrl: any;
        value: string;
    }[] | null>;
    decodeMessagesFromTheTxBody(messages: any[] | undefined): Promise<{
        typeUrl: any;
        value: any;
    }[] | null>;
    execEvm(payload: evm.DynamicFeeTx, keyPair: WalletTypes.KeyPairInfo, simulate: boolean): Promise<TxRaw | number>;
    signForEvm(payload: evm.DynamicFeeTx, keyPair: WalletTypes.KeyPairInfo): Promise<TxRaw>;
    private getEthSecpStratosEncodedPubkey;
    private signDirectStratos;
}
export {};
