import { GeneratedType } from '@cosmjs/proto-signing';
import { defaultRegistryTypes } from '@cosmjs/stargate';
import * as stratosTypes from '@stratos-network/stratos-cosmosjs-types';
import * as evm from '../transactions/evm';
import * as Types from './types';

export const getStratosTransactionRegistryTypes = () => {
  const msgPrepayProto = stratosTypes.stratos.sds.v1.MsgPrepay;
  const stratosTxRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
    ...defaultRegistryTypes,
    [Types.TxMsgTypes.SdsPrepay, msgPrepayProto],
    ...evm.registryTypes,
    // [Types.TxMsgTypes.PotWithdraw, Coin],
    // [Types.TxMsgTypes.PotFoundationDeposit, Coin],

    // [Types.TxMsgTypes.RegisterCreateResourceNode, Coin],
    // [Types.TxMsgTypes.RegisterRemoveResourceNode, Coin],
    // [Types.TxMsgTypes.RegisterCreateIndexingNode, Coin],
    // [Types.TxMsgTypes.RegisterRemoveIndexingNode, Coin],
  ];

  return stratosTxRegistryTypes;
};
