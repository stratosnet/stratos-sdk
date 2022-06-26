import { AmountType, TxMsgTypes } from '../transactions/types';
export interface AccountsData {
    height: string;
    result: {
        type: TxMsgTypes.Account;
        value: {
            address: string;
            public_key: any;
            account_number: string;
            sequence: string;
            coins: AmountType[];
        };
    };
}
export interface CosmosBaseAccount {
    address: string;
    pu_key: string;
    account_number: string;
    sequence: string;
}
export interface CosmosAccountData {
    account: {
        '@type': string;
        base_account: CosmosBaseAccount;
        code_hash: string;
    };
}
