interface DetailedDelegationInfo {
    [key: string]: string;
}
type SendDelegateTxDetailedResponse = {
    validatorsToUse: Array<{
        validatorAddress: string;
    }>;
    totalDelegated: string;
    detailedBalance: {
        delegated: DetailedDelegationInfo;
    };
};
type SendDelegateTxResponse = true | SendDelegateTxDetailedResponse;
export declare const isDetailedDelegateTxResponse: (delegateTxResponse: SendDelegateTxResponse) => delegateTxResponse is SendDelegateTxDetailedResponse;
export declare const createAnAccount: (hdPathIndex?: number) => Promise<boolean>;
export declare const restoreAccount: (hdPathIndex?: number) => Promise<boolean>;
export declare const getFaucetAvailableBalance: (hdPathIndex?: number) => Promise<boolean>;
export declare const sendTransferTx: (hdPathIndex?: number, givenReceiverMnemonic?: string) => Promise<boolean>;
export declare const sendDelegateTx: (hdPathIndex?: number, givenReceiverMnemonic?: string, expectedDelegated?: string, isCalledAsAHelper?: boolean) => Promise<SendDelegateTxResponse>;
export declare const sendBeginRedelegateTx: (hdPathIndex?: number, givenReceiverMnemonic?: string, expectedDelegated?: string) => Promise<boolean>;
export declare const sendWithdrawRewardsTx: (hdPathIndex?: number, givenReceiverMnemonic?: string) => Promise<boolean>;
export declare const sendWithdrawAllRewardsTx: (hdPathIndex?: number, givenReceiverMnemonic?: string) => Promise<boolean>;
export declare const sendUndelegateTx: (hdPathIndex?: number, givenReceiverMnemonic?: string, expectedDelegated?: string) => Promise<boolean>;
export declare const sendSdsPrepayTx: (hdPathIndex?: number, givenReceiverMnemonic?: string, expectedToSend?: number) => Promise<boolean>;
export declare const getAccountOzoneBalance: (hdPathIndex?: number, givenReceiverMnemonic?: string, minExpectedOzone?: string) => Promise<boolean>;
export declare const uploadFileToRemote: (fileReadName: string, randomTestPreffix: string, hdPathIndex?: number, givenReceiverMnemonic?: string) => Promise<boolean>;
export declare const downloadFileFromRemote: (fileReadName: string, randomTestPreffix: string, hdPathIndex?: number, givenReceiverMnemonic?: string) => Promise<boolean>;
export {};
