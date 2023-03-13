import * as TxTypes from '../../../transactions/types';
import * as NetworkTypes from '../../network/types';
import * as Types from '../transactions/types';
export declare const TxHistoryTypesMap: Map<string, Types.TxFormatter>;
export declare const getTransformer: (txType: TxTypes.TxMsgTypes) => Types.TxFormatter;
export declare const transformTx: (txResponseItem: NetworkTypes.RestTxResponse) => Types.FormattedBlockChainTx;
