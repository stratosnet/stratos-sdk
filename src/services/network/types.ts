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
}

export interface AccountsDataResult extends NetworkAxiosDataResult {}

export type TransactionData = string;

export interface ParsedTransactionData {}

export interface SubmitTransactionDataResult extends NetworkAxiosDataResult {
  response?: string;
}
