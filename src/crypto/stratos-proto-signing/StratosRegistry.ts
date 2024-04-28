import { GeneratedType } from '@cosmjs/proto-signing';
import { defaultRegistryTypes } from '@cosmjs/stargate';
import * as stratosTypes from '@stratos-network/stratos-cosmosjs-types';
import { evmTransactions as evm } from '../../chain/evm';
import { TxMsgTypesSds } from '../../sds/transactions/types';

export const getStratosTransactionRegistryTypes = () => {
  const msgPrepayProto = stratosTypes.stratos.sds.v1.MsgPrepay;
  const stratosTxRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
    ...defaultRegistryTypes,
    [TxMsgTypesSds.SdsPrepay, msgPrepayProto],
    ...evm.registryTypes,
  ];

  return stratosTxRegistryTypes;
};
