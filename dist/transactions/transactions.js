"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSdsPrepayTx = exports.getWithdrawalAllRewardTx = exports.getWithdrawalRewardTx = exports.getUnDelegateTx = exports.getDelegateTx = exports.getSendTx = exports.getStandardAmount = exports.sign = exports.getStandardFee = exports.broadcast = exports.getStratosTransactionRegistryTypes = void 0;
const stargate_1 = require("@cosmjs/stargate");
const stratosTypes = __importStar(require("@stratos-network/stratos-cosmosjs-types"));
const tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const hdVault_1 = require("../config/hdVault");
const tokens_1 = require("../config/tokens");
// import Sdk from '../Sdk';
const bigNumber_1 = require("../services/bigNumber");
const cosmos_1 = require("../services/cosmos");
const validators_1 = require("../validators");
const Types = __importStar(require("./types"));
const maxMessagesPerTx = 500;
function* payloadGenerator(dataList) {
    while (dataList.length) {
        yield dataList.shift();
    }
}
const getStratosTransactionRegistryTypes = () => {
    const msgPrepayProto = stratosTypes.stratos.sds.v1.MsgPrepay;
    const stratosTxRegistryTypes = [
        ...stargate_1.defaultRegistryTypes,
        [Types.TxMsgTypes.SdsPrepay, msgPrepayProto],
        // [Types.TxMsgTypes.PotWithdraw, Coin],
        // [Types.TxMsgTypes.PotFoundationDeposit, Coin],
        // [Types.TxMsgTypes.RegisterCreateResourceNode, Coin],
        // [Types.TxMsgTypes.RegisterRemoveResourceNode, Coin],
        // [Types.TxMsgTypes.RegisterCreateIndexingNode, Coin],
        // [Types.TxMsgTypes.RegisterRemoveIndexingNode, Coin],
    ];
    return stratosTxRegistryTypes;
};
exports.getStratosTransactionRegistryTypes = getStratosTransactionRegistryTypes;
const broadcast = async (signedTx) => {
    try {
        const client = await (0, cosmos_1.getCosmos)();
        const txBytes = tx_1.TxRaw.encode(signedTx).finish();
        console.log('🚀 ~ file: transactions.ts ~ line 28 ~ broadcast ~ txBytes to be broadcasted', JSON.stringify(txBytes));
        const result = await client.broadcastTx(txBytes);
        console.log('🚀 ~ file: transactions.ts ~ line 52 ~ broadcast ~ result', result);
        return result;
    }
    catch (err) {
        console.log('Could not broadcast', err.message);
        throw err;
    }
};
exports.broadcast = broadcast;
const getStandardFee = async (signerAddress, txMessages, memo = '') => {
    if (txMessages.length > maxMessagesPerTx) {
        throw new Error(`Exceed max messages for fee calculation (got: ${txMessages.length}, limit: ${maxMessagesPerTx})`);
    }
    const client = await (0, cosmos_1.getCosmos)();
    const gas = await client.simulate(signerAddress, txMessages, memo);
    const estimatedGas = gas + tokens_1.gasDelta;
    const amount = tokens_1.minGasPrice.multipliedBy(estimatedGas).toString();
    const feeAmount = [{ amount, denom: hdVault_1.stratosDenom }];
    const fees = {
        amount: feeAmount,
        gas: `${estimatedGas}`,
    };
    return fees;
};
exports.getStandardFee = getStandardFee;
const sign = async (address, txMessages, memo = '', givenFee) => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const fee = givenFee ? givenFee : (await (0, exports.getStandardFee)(address, txMessages, memo));
    const client = await (0, cosmos_1.getCosmos)();
    const signedTx = await client.sign(address, txMessages, fee, memo);
    return signedTx;
};
exports.sign = sign;
const getStandardAmount = (amounts) => {
    const result = amounts.map(amount => ({
        amount: (0, bigNumber_1.toWei)(amount, tokens_1.decimalPrecision).toString(),
        denom: hdVault_1.stratosDenom,
    }));
    return result;
};
exports.getStandardAmount = getStandardAmount;
// @depricated ?
// export const getBaseTx = async (
//   keyPairAddress: string,
//   memo = '',
//   numberOfMessages = 1,
// ): Promise<Types.BaseTransaction> => {
//   console.log('get base tx 1');
//   const accountsData = await getAccountsData(keyPairAddress);
//   const oldSequence = String(accountsData.account.sequence);
//   const newSequence = parseInt(oldSequence);
//   const { chainId } = Sdk.environment;
//   const myTx = {
//     chain_id: chainId,
//     fee: getStandardFee(numberOfMessages),
//     memo,
//     account_number: String(accountsData.account.account_number),
//     sequence: `${newSequence}`,
//   };
//   return myTx;
// };
const getSendTx = async (keyPairAddress, sendPayload) => {
    const payloadToProcess = payloadGenerator(sendPayload);
    let iteratedData = payloadToProcess.next();
    const messagesList = [];
    while (iteratedData.value) {
        const { amount, toAddress } = iteratedData.value;
        const message = {
            typeUrl: Types.TxMsgTypes.Send,
            value: {
                amount: (0, exports.getStandardAmount)([amount]),
                fromAddress: keyPairAddress,
                toAddress: toAddress,
            },
        };
        messagesList.push(message);
        iteratedData = payloadToProcess.next();
    }
    return messagesList;
};
exports.getSendTx = getSendTx;
const getDelegateTx = async (delegatorAddress, delegatePayload) => {
    const payloadToProcess = payloadGenerator(delegatePayload);
    let iteratedData = payloadToProcess.next();
    const messagesList = [];
    while (iteratedData.value) {
        const { amount, validatorAddress } = iteratedData.value;
        const message = {
            typeUrl: Types.TxMsgTypes.Delegate,
            value: {
                amount: {
                    amount: (0, bigNumber_1.toWei)(amount, tokens_1.decimalPrecision).toString(),
                    denom: hdVault_1.stratosDenom,
                },
                delegatorAddress: delegatorAddress,
                validatorAddress: validatorAddress,
            },
        };
        messagesList.push(message);
        iteratedData = payloadToProcess.next();
    }
    return messagesList;
};
exports.getDelegateTx = getDelegateTx;
const getUnDelegateTx = async (delegatorAddress, unDelegatePayload) => {
    const payloadToProcess = payloadGenerator(unDelegatePayload);
    let iteratedData = payloadToProcess.next();
    const messagesList = [];
    while (iteratedData.value) {
        const { amount, validatorAddress } = iteratedData.value;
        const message = {
            typeUrl: Types.TxMsgTypes.Undelegate,
            value: {
                amount: {
                    amount: (0, bigNumber_1.toWei)(amount, tokens_1.decimalPrecision).toString(),
                    denom: hdVault_1.stratosDenom,
                },
                delegatorAddress: delegatorAddress,
                validatorAddress: validatorAddress,
            },
        };
        messagesList.push(message);
        iteratedData = payloadToProcess.next();
    }
    return messagesList;
};
exports.getUnDelegateTx = getUnDelegateTx;
const getWithdrawalRewardTx = async (delegatorAddress, withdrawalPayload) => {
    const payloadToProcess = payloadGenerator(withdrawalPayload);
    let iteratedData = payloadToProcess.next();
    const messagesList = [];
    while (iteratedData.value) {
        const { validatorAddress } = iteratedData.value;
        const message = {
            typeUrl: Types.TxMsgTypes.WithdrawRewards,
            value: {
                delegatorAddress: delegatorAddress,
                validatorAddress: validatorAddress,
            },
        };
        messagesList.push(message);
        iteratedData = payloadToProcess.next();
    }
    return messagesList;
};
exports.getWithdrawalRewardTx = getWithdrawalRewardTx;
const getWithdrawalAllRewardTx = async (delegatorAddress) => {
    const vListResult = await (0, validators_1.getValidatorsBondedToDelegator)(delegatorAddress);
    const { data: withdrawalPayload } = vListResult;
    const payloadToProcess = payloadGenerator(withdrawalPayload.map((item) => ({ validatorAddress: item.address })));
    let iteratedData = payloadToProcess.next();
    const messagesList = [];
    while (iteratedData.value) {
        const { validatorAddress } = iteratedData.value;
        const message = {
            typeUrl: Types.TxMsgTypes.WithdrawRewards,
            value: {
                delegatorAddress: delegatorAddress,
                validatorAddress: validatorAddress,
            },
        };
        messagesList.push(message);
        iteratedData = payloadToProcess.next();
    }
    return messagesList;
};
exports.getWithdrawalAllRewardTx = getWithdrawalAllRewardTx;
const getSdsPrepayTx = async (senderAddress, prepayPayload) => {
    const payloadToProcess = payloadGenerator(prepayPayload);
    let iteratedData = payloadToProcess.next();
    const messagesList = [];
    while (iteratedData.value) {
        const { amount } = iteratedData.value;
        const message = {
            typeUrl: Types.TxMsgTypes.SdsPrepay,
            value: {
                sender: senderAddress,
                coins: (0, exports.getStandardAmount)([amount]),
            },
        };
        console.log('message to be signed', JSON.stringify(message));
        messagesList.push(message);
        iteratedData = payloadToProcess.next();
    }
    return messagesList;
};
exports.getSdsPrepayTx = getSdsPrepayTx;
//# sourceMappingURL=transactions.js.map