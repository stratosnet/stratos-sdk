export enum CosmosMsgTypes {
  Account = 'cosmos-sdk/Account',
  Send = 'cosmos-sdk/MsgSend',
  Delegate = 'cosmos-sdk/MsgDelegate',
}

export interface AccountsData {
  height: string;
  result: {
    type: CosmosMsgTypes.Account;
    value: {
      address: string;
      public_key: any;
      account_number: string;
      sequence: string;
    };
  };
}

export interface BroadcastResult {
  height: string;
  txhash: string;
  raw_log?: string;
}

export interface AmountType {
  amount: string;
  denom: string;
}

export interface TransactionValue {
  amount: AmountType | AmountType[];
}

export interface TransactionFee {
  amount: AmountType[];
  gas: string;
}

export interface SendTransactionValue extends TransactionValue {
  from_address: string;
  to_address: string;
}

export interface DelegateTransactionValue extends TransactionValue {
  delegator_address: string;
  validator_address: string;
}

type TransactionType = CosmosMsgTypes.Account | CosmosMsgTypes.Send | CosmosMsgTypes.Delegate;
type TransactionValueType = SendTransactionValue | DelegateTransactionValue;

export interface TransactionMessage {
  type: TransactionType;
  value: TransactionValueType;
}
export interface BaseTransaction {
  chain_id: string;
  account_number: string;
  sequence: string;
  memo: string;
  fee: TransactionFee;
}

export interface Transaction extends BaseTransaction {
  msgs: TransactionMessage[];
}

export interface SignedTransaction {
  tx: {
    msg: any[];
    fee: any;
    signatures: any[];
    memo: string;
  };
  mode: 'sync';
}

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
