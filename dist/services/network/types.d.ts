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
export interface AccountsDataResult extends NetworkAxiosDataResult {
}
export interface CosmosAccountsDataResult extends NetworkAxiosDataResult {
    response?: {
        account: CosmosAccount;
    };
}
export type RestPagination = {
    next_key: null | number;
    total: string;
};
export interface DelegatedBalanceResult {
    delegation: {
        delegator_address: string;
        validator_address: string;
        shares: string;
    };
    balance: Amount;
}
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
export interface AvailableBalanceResponseO {
    height: number;
    result: Amount[];
}
export interface AvailableBalanceResponseN {
    balances: Amount[];
    pagination: RestPagination | null;
}
export type AvailableBalanceResponse = AvailableBalanceResponseN | AvailableBalanceResponseO;
export interface AvailableBalanceDataResultO extends NetworkAxiosDataResult {
    response?: AvailableBalanceResponseO;
}
export interface AvailableBalanceDataResultN extends NetworkAxiosDataResult {
    response?: AvailableBalanceResponseN;
}
export type AvailableBalanceDataResult = AvailableBalanceDataResultO | AvailableBalanceDataResultN;
export interface DelegatedBalanceDataResult extends NetworkAxiosDataResult {
    response?: {
        delegation_responses: DelegatedBalanceResult[];
        pagination: RestPagination | null;
    };
}
export interface RewardBalanceDataResult extends NetworkAxiosDataResult {
    response?: {
        rewards: Rewards[];
        total: Amount[];
    };
}
export interface UnboundingBalanceDataResult extends NetworkAxiosDataResult {
    response?: {
        unbonding_responses: UnboundingBalanceResult[];
        pagination: RestPagination | null;
    };
}
export type TransactionData = string;
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
    pagination: RestPagination | null;
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
export interface MainRpcResponse {
    id: string;
    jsonrpc: string;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}
export interface EthProtocolRpcResponse extends MainRpcResponse {
    result: string;
}
export interface EthProtocolRpcResult extends NetworkAxiosDataResult {
    response?: EthProtocolRpcResponse;
}
export interface FileUserRequestResult<T> extends NetworkAxiosDataResult {
    response?: T;
}
export interface FileUserRequestListParams {
    walletaddr: string;
    page: number;
    signature: UserFileSignature;
    req_time: number;
}
export interface FileInfoItem {
    filehash: string;
    filesize: number;
    filename: string;
    createtime: number;
}
export interface SharedFileInfoItem extends Omit<FileInfoItem, 'createtime>'> {
    linktime: number;
    linktimeexp: number;
    shareid: string;
    sharelink: string;
}
export interface FileUserRequestListResponse extends MainRpcResponse {
    result: {
        return: '0' | '1';
        fileinfo: FileInfoItem[];
    };
}
export interface FileUserRequestUploadParams {
    filename: string;
    filesize: number;
    filehash: string;
    signature: UserFileSignature;
    req_time: number;
}
export interface FileUserRequestDownloadParams {
    filehandle: string;
    signature: UserFileSignature;
    req_time: number;
}
export interface UserFileSignature {
    address: string;
    pubkey: string;
    signature: string;
}
export interface FileUserRequestDownloadResponse extends MainRpcResponse {
    result: {
        return: '0' | '1' | '2' | '3' | '4';
        reqid: string;
        offsetstart: string;
        offsetend: string;
        filedata: string;
    };
}
export interface FileUserRequestDownloadSharedResponse extends FileUserRequestDownloadResponse {
}
export interface FileUserDownloadDataParams {
    filehash: string;
    reqid: string;
}
export interface FileUserDownloadDataResponse extends MainRpcResponse {
    result: {
        return: '0' | '1' | '2' | '3';
        offsetstart?: string;
        offsetend?: string;
        filedata?: string;
    };
}
export interface FileUserDownloadedFileInfoParams {
    filehash: string;
    reqid: string;
    filesize?: number;
}
export interface FileUserDownloadedFileInfoResponse extends MainRpcResponse {
    result: {
        return: '0' | '1' | '2' | '3';
    };
}
export interface FileUserRequestUploadResponse extends MainRpcResponse {
    result: {
        return: '0' | '1';
        offsetstart?: string;
        offsetend?: string;
    };
}
export interface FileUserUploadDataParams {
    filehash: string;
    data: string;
}
export interface FileUserUploadDataResponse extends MainRpcResponse {
    result: {
        return: '0' | '1';
        offsetstart?: string;
        offsetend?: string;
    };
}
export interface FileUserRequestGetOzoneParams {
    walletaddr: string;
}
export interface FileUserRequestGetOzoneResponse extends MainRpcResponse {
    result: {
        return: '0' | '1';
        ozone?: string;
        sequencynumber?: string;
    };
}
export interface RestTxFeeInfo {
    amount: Amount[];
    gas_limit: string;
    payer: string;
    granter: string;
}
export interface RestTxAuthInfo {
    signer_infos: RestTxSignerInfo[];
    fee: RestTxFeeInfo;
}
export interface RestTxSignerInfo {
    public_key: {
        ['@type']: string;
        key: string;
    };
    mode_info: {
        single: {
            mode: string;
        };
    };
    sequence: string;
}
export interface RestTxHistoryDataResult extends NetworkAxiosDataResult {
    response?: RestTxHistoryResponse;
}
export interface RestTxHistoryResponse {
    pagination: RestPagination | null;
    txs: RestTx[];
    tx_responses: RestTxResponse[];
}
export interface RestTx {
    body: RestTxBody;
    auth_info: RestTxAuthInfo;
    signatures: string[];
}
export interface RestTxResponse {
    height: string;
    txhash: string;
    codespace: string;
    code: number;
    data: string;
    raw_log: string;
    logs: RestTxResponseLog[];
    info: string;
    gas_wanted: string;
    gas_used: string;
    tx: RestTxResponseTx;
    timestamp: string;
    events: RestTxResponseEvent[];
}
export interface RestTxBody {
    messages: RestTxBodyMessage[];
    memo: string;
    timeout_height: string;
    extension_options: [];
    non_critical_extension_options: [];
}
export interface RestSendTxBody extends RestTxBody {
    messages: RestSendTxBodyMessage[];
}
export interface RestDelegateTxBody extends RestTxBody {
    messages: RestDelegateTxBodyMessage[];
}
export interface RestUndelegateTxBody extends RestTxBody {
    messages: RestUndelegateTxBodyMessage[];
}
export interface RestGetRewardsTxBody extends RestTxBody {
    messages: RestGetRewardsTxBodyMessage[];
}
export interface RestSdsPrepayTxBody extends RestTxBody {
    messages: RestSdsPrepayTxBodyMessage[];
}
export interface RestTxBodyMessage {
    ['@type']: string;
}
export interface RestSendTxBodyMessage extends RestTxBodyMessage {
    from_address: string;
    to_address: string;
    amount: Amount[];
}
export interface RestDelegateTxBodyMessage extends RestTxBodyMessage {
    delegator_address: string;
    validator_address: string;
    amount: Amount;
}
export interface RestBeginRedelegateTxBodyMessage extends RestTxBodyMessage {
    delegator_address: string;
    validator_src_address: string;
    validator_dst_address: string;
    amount: Amount;
}
export interface RestUndelegateTxBodyMessage extends RestDelegateTxBodyMessage {
}
export interface RestGetRewardsTxBodyMessage extends RestTxBodyMessage {
    delegator_address: string;
    validator_address: string;
}
export interface RestSdsPrepayTxBodyMessage extends RestTxBodyMessage {
    sender: string;
    amount: Amount[];
}
export interface RestSendTx extends RestTx {
    body: RestSendTxBody;
}
export interface RestDelegateTx {
    body: RestDelegateTxBody;
}
export interface RestUndelegateTx {
    body: RestUndelegateTxBody;
}
export interface RestGetRewardsTx {
    body: RestGetRewardsTxBody;
}
export interface RestSdsPrepayTx {
    body: RestSdsPrepayTxBody;
}
export interface RestTxResponseEventAttribute {
    key: string;
    value: string;
    index: boolean;
}
export interface RestTxResponseEvent {
    type: string;
    attributes: RestTxResponseEventAttribute[];
}
export interface RestTxResponseLog {
    msg_index: number;
    log: string;
    events: RestTxResponseEvent[];
}
export interface RestTxResponseTx extends RestTx {
    ['@type']: string;
}
export interface RestTxErrorResponse {
    code: number;
    message: string;
    details: string[];
}
export interface FileUserRequestShareParams {
    filehash: string;
    duration: number;
    bool: boolean;
    signature: UserFileSignature;
    req_time: number;
}
export interface FileUserRequestShareResponse extends MainRpcResponse {
    result: {
        return: '0' | '1' | '2';
        shareid: string;
        sharelink: string;
    };
}
export interface FileUserRequestListShareParams {
    page: number;
    signature: UserFileSignature;
    req_time: number;
}
export interface FileUserRequestListShareResponse extends MainRpcResponse {
    result: {
        return: '0' | '1' | '2';
        fileinfo?: SharedFileInfoItem[];
        totalnumber?: number;
    };
}
export interface FileUserRequestStopShareParams {
    shareid: string;
    signature: UserFileSignature;
    req_time: number;
}
export interface FileUserRequestStopShareResponse extends MainRpcResponse {
    result: {
        return: '0' | '1' | '2';
    };
}
export interface FileUserRequestGetSharedParams {
    sharelink: string;
    signature: UserFileSignature;
    req_time: number;
}
export interface FileUserRequestGetSharedResponse extends MainRpcResponse {
    result: {
        return: '0' | '1' | '2' | '3' | '4';
        reqid: string;
        filehash: string;
        sequencenumber: string;
    };
}
export interface FileUserRequestDownloadSharedParams {
    filehash: string;
    reqid: string;
    signature: UserFileSignature;
    req_time: number;
}
export interface FileUserRequestGetFileStatusParams {
    filehash: string;
    signature: UserFileSignature;
    req_time: number;
}
export interface FileUserRequestGetFileStatusResponse extends MainRpcResponse {
    result: {
        return: '0' | '1' | '2' | '3';
        file_upload_state: number;
        user_has_file: boolean;
        replicas: number;
    };
}
export type TxHistoryUserTypes = typeof TxHistoryUser;
export type TxHistoryUserType = (typeof TxHistoryUser)[keyof TxHistoryUserTypes];
export declare const TxHistoryUser: {
    readonly TxHistorySenderUser: 1;
    readonly TxHistoryReceiverUser: 2;
};
