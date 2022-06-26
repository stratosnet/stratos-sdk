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

// merge with network
export interface CosmosBaseAccount {
  address: string;
  pu_key: string;
  account_number: string;
  sequence: string;
}

// merge with network
export interface CosmosAccountData {
  account: {
    '@type': string; // one of the cosmojs types - add a guard later
    base_account: CosmosBaseAccount;
    code_hash: string;
  };
}
