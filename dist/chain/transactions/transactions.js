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
exports.getWithdrawalAllRewardTx = exports.getWithdrawalRewardTx = exports.getUnDelegateTx = exports.getBeginRedelegateTx = exports.getDelegateTx = exports.getSendTx = exports.sign = exports.getStandardFee = exports.getStandardDefaultFee = exports.broadcast = exports.encodeTxRawToEncodedTx = exports.decodeTxRawToTxHr = exports.decodeTxRawToTx = exports.encodeTxHrToTx = exports.assembleTxRawFromTx = void 0;
const tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const transactionsCommon = __importStar(require("../../common/transactions"));
const hdVault_1 = require("../../config/hdVault");
const tokens_1 = require("../../config/tokens");
const bigNumber_1 = require("../../services/bigNumber");
const helpers_1 = require("../../services/helpers");
const cosmos_1 = require("../cosmos");
const validators_1 = require("../validators");
const Types = __importStar(require("./types"));
const maxMessagesPerTx = 500;
const assembleTxRawFromTx = (tx) => {
    const txR = tx_1.TxRaw.fromPartial({
        bodyBytes: tx_1.TxBody.encode(tx.body).finish(),
        authInfoBytes: tx_1.AuthInfo.encode(tx.authInfo).finish(),
        signatures: tx.signatures.map(ss => ss),
    });
    return txR;
};
exports.assembleTxRawFromTx = assembleTxRawFromTx;
const encodeTxHrToTx = async (jsonizedTx) => {
    const client = await cosmos_1.cosmosService.getCosmos();
    const encodedMessages = await client.encodeMessagesFromTheTxBody(jsonizedTx.body.messages);
    if (encodedMessages) {
        jsonizedTx.body.messages = encodedMessages;
    }
    const encoded = tx_1.Tx.fromJSON(jsonizedTx);
    return encoded;
};
exports.encodeTxHrToTx = encodeTxHrToTx;
const decodeTxRawToTx = (signedTx) => {
    const txBodyObject = tx_1.TxBody.decode(signedTx.bodyBytes);
    const authInfo = tx_1.AuthInfo.decode(signedTx.authInfoBytes);
    const decoded = tx_1.Tx.fromPartial({
        authInfo,
        body: txBodyObject,
        signatures: signedTx.signatures.map(ss => ss),
    });
    return decoded;
};
exports.decodeTxRawToTx = decodeTxRawToTx;
const decodeTxRawToTxHr = async (signedTx) => {
    var _a;
    const client = await cosmos_1.cosmosService.getCosmos();
    const decoded = (0, exports.decodeTxRawToTx)(signedTx);
    const jsonizedTx = tx_1.Tx.toJSON(decoded);
    const decodedMessages = await client.decodeMessagesFromTheTxBody((_a = decoded.body) === null || _a === void 0 ? void 0 : _a.messages);
    if (decodedMessages) {
        jsonizedTx.body.messages = decodedMessages;
    }
    return jsonizedTx;
};
exports.decodeTxRawToTxHr = decodeTxRawToTxHr;
const encodeTxRawToEncodedTx = (signedTx) => {
    const txBytes = tx_1.TxRaw.encode(signedTx).finish();
    return txBytes;
};
exports.encodeTxRawToEncodedTx = encodeTxRawToEncodedTx;
const broadcast = async (signedTx) => {
    try {
        const client = await cosmos_1.cosmosService.getCosmos();
        const txBytes = (0, exports.encodeTxRawToEncodedTx)(signedTx);
        const result = await client.broadcastTx(txBytes);
        (0, helpers_1.dirLog)('🚀 ~ file: transactions.ts ~  broadcast ~ result', result);
        return result;
    }
    catch (err) {
        (0, helpers_1.dirLog)('transactions.broadcastTx Could not broadcast', err.message);
        throw err;
    }
};
exports.broadcast = broadcast;
const getStandardDefaultFee = () => {
    const gas = tokens_1.baseGasAmount + tokens_1.perMsgGasAmount;
    const dynamicFeeAmount = (0, tokens_1.standardFeeAmount)(gas);
    const feeAmount = [{ amount: String(dynamicFeeAmount), denom: hdVault_1.stratosDenom }];
    const fee = {
        amount: feeAmount,
        gas: `${gas}`,
    };
    (0, helpers_1.dirLog)('standard default fee', fee);
    return fee;
};
exports.getStandardDefaultFee = getStandardDefaultFee;
const getStandardFee = async (signerAddress, txMessages) => {
    if (!txMessages || !signerAddress) {
        return (0, exports.getStandardDefaultFee)();
    }
    if (txMessages.length > maxMessagesPerTx) {
        throw new Error(`Exceed max messages for fee calculation (got: ${txMessages.length}, limit: ${maxMessagesPerTx})`);
    }
    try {
        const client = await cosmos_1.cosmosService.getCosmos();
        const gas = await client.simulate(signerAddress, txMessages, '');
        const estimatedGas = Math.round(gas * tokens_1.gasAdjustment);
        const amount = tokens_1.minGasPrice.mul(estimatedGas).toString();
        const feeAmount = [
            {
                amount,
                denom: hdVault_1.stratosDenom,
            },
        ];
        const fees = {
            amount: feeAmount,
            gas: `${estimatedGas}`,
        };
        return fees;
    }
    catch (error) {
        (0, helpers_1.log)('Full error from simutlate', error);
        throw new Error(`Could not simutlate the fee calculation. Error details: ${error.message || JSON.stringify(error)}`);
    }
};
exports.getStandardFee = getStandardFee;
const sign = async (address, txMessages, memo = '', givenFee) => {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const fee = givenFee ? givenFee : await (0, exports.getStandardFee)(address, txMessages);
    const client = await cosmos_1.cosmosService.getCosmos();
    const signedTx = await client.sign(address, txMessages, fee, memo);
    return signedTx;
};
exports.sign = sign;
const getSendTx = async (keyPairAddress, sendPayload) => {
    const payloadToProcess = transactionsCommon.payloadGenerator(sendPayload);
    let iteratedData = payloadToProcess.next();
    const messagesList = [];
    while (iteratedData.value) {
        const { amount, toAddress } = iteratedData.value;
        const message = {
            typeUrl: Types.TxMsgTypes.Send,
            value: {
                amount: transactionsCommon.getStandardAmount([amount]),
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
    const payloadToProcess = transactionsCommon.payloadGenerator(delegatePayload);
    let iteratedData = payloadToProcess.next();
    const messagesList = [];
    while (iteratedData.value) {
        const { amount, validatorAddress } = iteratedData.value;
        const message = {
            typeUrl: Types.TxMsgTypes.Delegate,
            value: {
                amount: {
                    amount: (0, bigNumber_1.toWei)(amount, tokens_1.decimalPrecision).toFixed(),
                    denom: hdVault_1.stratosDenom,
                },
                delegatorAddress: delegatorAddress,
                validatorAddress: validatorAddress,
            },
        };
        console.log('message to Delegate', message);
        messagesList.push(message);
        iteratedData = payloadToProcess.next();
    }
    return messagesList;
};
exports.getDelegateTx = getDelegateTx;
const getBeginRedelegateTx = async (delegatorAddress, delegatePayload) => {
    const payloadToProcess = transactionsCommon.payloadGenerator(delegatePayload);
    let iteratedData = payloadToProcess.next();
    const messagesList = [];
    while (iteratedData.value) {
        const { amount, validatorSrcAddress, validatorDstAddress } = iteratedData.value;
        const message = {
            typeUrl: Types.TxMsgTypes.BeginRedelegate,
            value: {
                amount: {
                    amount: (0, bigNumber_1.toWei)(amount, tokens_1.decimalPrecision).toFixed(),
                    denom: hdVault_1.stratosDenom,
                },
                delegatorAddress: delegatorAddress,
                validatorSrcAddress: validatorSrcAddress,
                validatorDstAddress: validatorDstAddress,
            },
        };
        messagesList.push(message);
        iteratedData = payloadToProcess.next();
    }
    return messagesList;
};
exports.getBeginRedelegateTx = getBeginRedelegateTx;
const getUnDelegateTx = async (delegatorAddress, unDelegatePayload) => {
    const payloadToProcess = transactionsCommon.payloadGenerator(unDelegatePayload);
    let iteratedData = payloadToProcess.next();
    const messagesList = [];
    while (iteratedData.value) {
        const { amount, validatorAddress } = iteratedData.value;
        const message = {
            typeUrl: Types.TxMsgTypes.Undelegate,
            value: {
                amount: {
                    amount: (0, bigNumber_1.toWei)(amount, tokens_1.decimalPrecision).toFixed(),
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
    const payloadToProcess = transactionsCommon.payloadGenerator(withdrawalPayload);
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
    const vListResult = await validators_1.validatorsApi.getValidatorsBondedToDelegator(delegatorAddress);
    const { data: withdrawalPayload } = vListResult;
    const payloadToProcess = transactionsCommon.payloadGenerator(withdrawalPayload.map((item) => ({
        validatorAddress: item.address,
    })));
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
//# sourceMappingURL=transactions.js.map