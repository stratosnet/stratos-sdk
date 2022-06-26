/// <reference types="node" />
import { AccountsData } from '../accounts/types';
import { BroadcastResult, SignedTransaction, Transaction, TransactionMessage } from '../transactions/types';
export interface CosmosInstance {
    url: string;
    chainId: string;
    path: string;
    bech32MainPrefix: string;
    broadcast(signedTx: SignedTransaction): Promise<BroadcastResult>;
    newStdMsg(tx: Transaction): TransactionMessage;
    sign(txMessage: TransactionMessage, pkey: Buffer): SignedTransaction;
    getAccounts(address: string): Promise<AccountsData>;
}
export declare class StratosCosmos {
    static cosmosInstance: CosmosInstance;
    static init(): void;
}
export declare const getCosmos: () => CosmosInstance;
