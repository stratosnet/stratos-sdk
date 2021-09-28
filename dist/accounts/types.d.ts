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
