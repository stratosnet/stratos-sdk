export declare const createAnAccount: (hdPathIndex?: number) => Promise<boolean>;
export declare const restoreAccount: (hdPathIndex?: number) => Promise<boolean>;
export declare const getFaucetAvailableBalance: (hdPathIndex?: number) => Promise<boolean>;
export declare const sendTransferTx: (hdPathIndex?: number, givenReceiverMnemonic?: string) => Promise<boolean>;
export declare const sendDelegateTx: (hdPathIndex?: number, givenReceiverMnemonic?: string, expectedDelegated?: string) => Promise<boolean>;
export declare const sendWithdrawRewardsTx: (hdPathIndex?: number, givenReceiverMnemonic?: string) => Promise<boolean>;
export declare const sendWithdrawAllRewardsTx: (hdPathIndex?: number, givenReceiverMnemonic?: string) => Promise<boolean>;
export declare const sendUndelegateTx: (hdPathIndex?: number, givenReceiverMnemonic?: string, expectedDelegated?: string) => Promise<boolean>;
