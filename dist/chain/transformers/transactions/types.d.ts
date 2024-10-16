import * as TxTypes from '../../../chain/transactions/types';
import * as NetworkTypes from '../../../network/networkTypes';
export type TxFormatter = (txResponseItemTxBodyMessage: NetworkTypes.RestTxBodyMessage, txResponseItemLogEntry?: NetworkTypes.RestTxResponseLog) => FormattedBlockChainTxMessage;
export interface FormattedBlockChainTxMessage {
    eventSender?: string;
    sender: string;
    to: string;
    from?: string;
    type: TxTypes.HistoryTxType;
    txType: string;
    amounts: NetworkTypes.Amount[];
}
export interface FormattedBlockChainTx {
    block: string;
    time: string;
    hash: string;
    txFee: string[];
    memo: string;
    statusCode: number;
    originalTransactionData: NetworkTypes.RestTxResponseTx;
    originalTxResponse: NetworkTypes.RestTxResponse;
    txMessages: FormattedBlockChainTxMessage[];
}
export interface ParsedTxData {
    data: FormattedBlockChainTx[];
    total: string;
    page: number;
}
