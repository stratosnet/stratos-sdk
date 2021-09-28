export interface ResultError {
    message: string;
}
export interface DataResult {
    response?: any;
    error?: ResultError;
}
export interface NetworkAxiosDataResult extends DataResult {
}
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
export interface AccountsDataResult extends NetworkAxiosDataResult {
}
export interface DelegatedBalanceResult {
    delegator_address: string;
    validator_address: string;
    shares: string;
    balance: any;
}
export interface Reward {
    validator_address: 'stvaloper1x8a6ug6wu8d269n5s75260grv60lkln0pewk5n';
    reward: any;
}
export interface Rewards {
    validator_address: 'stvaloper1x8a6ug6wu8d269n5s75260grv60lkln0pewk5n';
    reward: Reward[];
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
export declare type TransactionData = string;
export interface ParsedTransactionData {
}
export interface SubmitTransactionDataResult extends NetworkAxiosDataResult {
    response?: string;
}
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
export declare type TxDataDataAmount = TxAmount[] | TxAmount;
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
