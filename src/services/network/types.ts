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

export interface ExplorerTxListDataResult extends NetworkAxiosDataResult {
  response?: ExplorerTxListResponse;
}
