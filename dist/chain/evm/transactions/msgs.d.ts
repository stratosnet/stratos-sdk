import { EncodeObject } from '@cosmjs/proto-signing';
import { DynamicFeeTx } from './types';
export declare const getEvmMsgs: (payload: DynamicFeeTx) => readonly EncodeObject[];
