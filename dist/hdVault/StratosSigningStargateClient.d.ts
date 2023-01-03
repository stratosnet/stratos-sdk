import { StdFee } from '@cosmjs/amino';
import { EncodeObject, // OfflineSigner,
OfflineDirectSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient, SignerData, SigningStargateClientOptions } from '@cosmjs/stargate';
import { HttpEndpoint, Tendermint34Client } from '@cosmjs/tendermint-rpc';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
export declare class StratosSigningStargateClient extends SigningStargateClient {
    protected readonly mySigner: OfflineDirectSigner;
    static connectWithSigner(endpoint: string | HttpEndpoint, signer: OfflineDirectSigner, options?: SigningStargateClientOptions): Promise<StratosSigningStargateClient>;
    protected constructor(tmClient: Tendermint34Client | undefined, signer: OfflineDirectSigner, options: SigningStargateClientOptions);
    sign(signerAddress: string, messages: readonly EncodeObject[], fee: StdFee, memo: string, explicitSignerData?: SignerData): Promise<TxRaw>;
    private signDirectStratos;
}
