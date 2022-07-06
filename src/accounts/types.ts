import {
  CosmosAccount as CosmosAccountNetwork,
  CosmosBaseAccount as CosmosBaseAccountNetwork,
} from '../services/network/types';
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

export interface CosmosBaseAccount extends CosmosBaseAccountNetwork {}

export interface CosmosAccountData {
  account: CosmosAccountNetwork;
}
