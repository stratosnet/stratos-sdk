export interface ResultError {
  message: string;
}

export interface DataResult {
  response?: any;
  error?: ResultError;
}

export interface NetworkAxiosDataResult extends DataResult {}

export interface NetworkAxiosResult {
  data: NetworkAxiosDataResult;
}

export interface NetworkAxiosHeaders {
  [key: string]: string | number;
  [index: number]: string;
  testHeader: string;
}

export interface NetworkAxiosConfig {
  headers?: NetworkAxiosHeaders;
  params?: any;
}

export interface AccountsDataResult extends NetworkAxiosDataResult {}

export type TransactionData = string;

export interface ParsedTransactionData {}

export interface SubmitTransactionDataResult extends NetworkAxiosDataResult {
  response?: string;
}

export interface TxAmount {
  denom: string;
  amount: number;
}

export interface TxFee {
  amount: TxAmount[];
  gas: string;
}

export interface TxData {
  sender: string;
  nonce?: number | null;
  data: {
    to: string;
    amount: TxAmount[];
  };
}

export interface TxOriginMsg {
  value: {
    from_address: string;
    to_address: string;
    amount: TxAmount[];
  };
}

export interface TxSignature {
  pub_key: {
    type: string;
    value: string;
  };
  signature: string;
}

export interface TxOrigin {
  type: string;
  value: {
    msg: TxOriginMsg[];
    fee: TxFee;
    memo: string;
    signatures: TxSignature[];
  };
}

export interface ExplorerTxData {
  txData: TxData;
  fee: TxFee;
  txType: string;
  hash: string;
  memo: string;
}

export interface ExplorerTxItem {
  transaction_data: ExplorerTxData;
  block_height: number;
  tx_hash: string;
  tx_type: string;
  time: string;
  transaction_data_orig: TxOrigin;
}

export interface ExplorerTxListResponse {
  msg: string;
  code: number;
  data: ExplorerTxItem[];
  total: number;
}

export interface ValidatorItem {
  operator_address: string;
  consensus_pubkey: string;
  jailed: boolean;
  status: number;
  tokens: string;
  delegator_shares: string;
  description: {
    moniker: string;
    identity: string;
    website: string;
    security_contact: string;
    details: string;
  };
  unbonding_height: string;
  unbonding_time: string;
  commission: {
    commission_rates: {
      rate: string;
      max_rate: string;
      max_change_rate: string;
    };
  };
  min_self_delegation: string;
}

export interface ValidatorListResponse {
  height: number;
  result: ValidatorItem[];
}

export interface ValidatorResponse {
  height: number;
  result: ValidatorItem;
}

export interface StakingPoolResponse {
  height: number;
  result: {
    not_bonded_tokens: string;
    bonded_tokens: string;
  };
}

export interface ExplorerTxListDataResult extends NetworkAxiosDataResult {
  response?: ExplorerTxListResponse;
}

export interface ValidatorListDataResult extends NetworkAxiosDataResult {
  response?: ValidatorListResponse;
}

export interface ValidatorDataResult extends NetworkAxiosDataResult {
  response?: ValidatorResponse;
}

export interface StakingPoolDataResult extends NetworkAxiosDataResult {
  response?: StakingPoolResponse;
}
