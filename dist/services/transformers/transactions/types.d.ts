import * as TxTypes from '../../../transactions/types';
import * as NetworkTypes from '../../network/types';
export type TxFormatter = (txItem: NetworkTypes.BlockChainTx) => FormattedBlockChainTx;
export interface FormattedBlockChainTx {
    eventSender?: string;
    sender: string;
    to: string;
    type: TxTypes.HistoryTxType;
    txType: string;
    block: string;
    amount: string;
    time: string;
    hash: string;
    txFee: string;
    originalTransactionData: NetworkTypes.BlockChainTx;
}
