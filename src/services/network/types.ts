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

export interface CosmosBaseAccount {
  address: string;
  pu_key: string;
  account_number: string;
  sequence: string;
}

export interface CosmosAccount {
  '@type': string;
  base_account: CosmosBaseAccount;
  code_hash: string;
  address: string;
  pub_key: string;
  account_number: string;
  sequence: string;
}

export interface AccountsDataResult extends NetworkAxiosDataResult {}

export interface CosmosAccountsDataResult extends NetworkAxiosDataResult {
  response?: {
    account: CosmosAccount;
  };
}

export interface CosmosAccountBalanceResponse {
  balances: Amount[];
  pagination: {
    next_key: string;
    total: string;
  };
}

export interface CosmosAccountBalanceDataResult extends NetworkAxiosDataResult {
  response?: CosmosAccountBalanceResponse;
}

export interface DelegatedBalanceResult {
  delegator_address: string;
  validator_address: string;
  shares: string;
  balance: Amount;
}

// export interface Reward {
//   validator_address: string;
//   reward: Amount[];
// }

export interface Rewards {
  validator_address: string;
  reward: Amount[];
}

export interface RewardBalanceResult {
  rewards: Rewards[];
  total: Amount[];
}

export interface UnboundingEntry {
  creation_height: string;
  completion_time: string;
  initial_balance: string;
  balance: string;
}
export interface DelegatedEntry {
  creation_height: string;
  completion_time: string;
  initial_balance: string;
  balance: string;
}
export interface UnboundingBalanceResult {
  delegator_address: string;
  validator_address: string;
  entries: UnboundingEntry[];
}

export interface AvailableBalanceResponse {
  height: number;
  result: Amount[];
}

export interface AvailableBalanceDataResult extends NetworkAxiosDataResult {
  response?: AvailableBalanceResponse;
}

export interface DelegatedBalanceDataResult extends NetworkAxiosDataResult {
  response?: {
    height: number;
    result: DelegatedBalanceResult[];
  };
}
export interface RewardBalanceDataResult extends NetworkAxiosDataResult {
  response?: {
    height: number;
    result: RewardBalanceResult;
  };
}

export interface UnboundingBalanceDataResult extends NetworkAxiosDataResult {
  response?: {
    height: number;
    result: UnboundingBalanceResult[];
  };
}

export type TransactionData = string;

export interface ParsedTransactionData {}

export interface SubmitTransactionDataResult extends NetworkAxiosDataResult {
  response?: string;
}

// @depricated
export interface TxAmount {
  denom: string;
  amount: number;
}

export interface Amount {
  denom: string;
  amount: string;
}

export interface TxFee {
  amount: TxAmount[];
  gas: string;
}

export type TxDataDataAmount = TxAmount[] | TxAmount;

export interface TxData {
  sender: string;
  nonce?: number | null;
  data: {
    to?: string;
    delegator_address?: string;
    validator_address?: string;
    amount: TxDataDataAmount;
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
  txType: string;
  txData: TxData;
  fee: TxFee;
  hash: string;
  memo: string;
}

export interface ExplorerTxItem {
  account: string;
  block_height: number;
  tx_type: string;
  tx_info: {
    tx_hash: string;
    tx_type: string;
    time: string;
    transaction_data: ExplorerTxData;
  };
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
  validators: ValidatorItem[];
  pagination: {
    next_key: string;
    total: string;
  };
}

export interface ValidatorResponse {
  validator: ValidatorItem;
}

export interface StakingPoolResponse {
  result: {
    not_bonded_tokens: string;
    bonded_tokens: string;
  };
}
export interface BlockChainTxEventAttribute {
  key: string;
  value: string;
}

export interface BlockChainTxEvent {
  type: string;
  attributes: BlockChainTxEventAttribute[];
}

export interface BlockChainTxLog {
  msg_index: string;
  log: string;
  events: BlockChainTxEvent[];
}

export interface BlockChainTxMessage {
  type: string;
  value: {
    from_address?: string;
    sender?: string;
    reporter?: string;
    delegator_address?: string;
    address?: string;
    from?: string;
    validator_address?: string;
    to_address?: string;
    amount: TxAmount | TxAmount[];
  };
}

export interface BlockChainSentTxMessage extends BlockChainTxMessage {
  value: {
    from_address: string;
    to_address: string;
    amount: TxAmount[];
  };
}

export interface BlockChainDelegatedTxMessage extends BlockChainTxMessage {
  value: {
    delegator_address: string;
    validator_address: string;
    amount: TxAmount;
  };
}

export interface BlockChainSubmittedTx {
  type: string;
  value: {
    msg: BlockChainTxMessage[];
    fee: TxFee;
    signatures: TxSignature[];
    memo: string;
  };
}

export interface BlockChainTx {
  height: string;
  txhash: string;
  raw_log: string;
  logs: BlockChainTxLog[];
  gas_wanted: string;
  gas_used: string;
  tx: BlockChainSubmittedTx;
  timestamp: string;
}

export interface RestTxListResponse {
  total_count: string;
  count: string;
  page_number: string;
  page_total: string;
  limit: string;
  txs: BlockChainTx[];
}

export interface RpcStatusResponse {
  result: {
    node_info: {
      protocol_version: {
        p2p: string;
        block: string;
        app: string;
      };
      id: string;
      listen_addr: string;
      network: string;
      version: string;
      channels: string;
      moniker: string;
    };
    sync_info: {
      latest_block_hash: string;
      latest_app_hash: string;
      latest_block_height: string;
      latest_block_time: string;
    };
    validator_info?: {
      address: string;
      voting_power: string;
    };
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
export interface RpcStatusDataResult extends NetworkAxiosDataResult {
  response?: RpcStatusResponse;
}

export interface RestTxListDataResult extends NetworkAxiosDataResult {
  response?: RestTxListResponse;
}
