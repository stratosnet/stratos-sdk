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
exports.getSdsPrepayTx = exports.getWithdrawalAllRewardTx = exports.getWithdrawalRewardTx = exports.getUnDelegateTx = exports.getDelegateTx = exports.getSendTx = exports.getStandardAmount = exports.sign = exports.getStandardFee = exports.getStandardDefaultFee = exports.broadcast = exports.encodeTxRawToEncodedTx = exports.decodeEncodedTxToHumanRead = exports.decodeTxRawToTxHr = exports.decodeTxRawToTx = exports.encodeTxHrToTx = exports.assembleTxRawFromString = exports.assembleTxFromString = exports.assembleTxRawFromTx = exports.assembleTxRawFromHumanRead = void 0;
const encoding_1 = require("@cosmjs/encoding");
const proto_signing_1 = require("@cosmjs/proto-signing");
const tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const hdVault_1 = require("../config/hdVault");
const tokens_1 = require("../config/tokens");
const bigNumber_1 = require("../services/bigNumber");
const cosmos_1 = require("../services/cosmos");
const helpers_1 = require("../services/helpers");
const validators_1 = require("../validators");
const Types = __importStar(require("./types"));
const maxMessagesPerTx = 500;
function* payloadGenerator(dataList) {
    while (dataList.length) {
        yield dataList.shift();
    }
}
const assembleTxRawFromHumanRead = (decoded) => {
    const txBytesAssembled = tx_1.TxRaw.fromPartial({
        bodyBytes: tx_1.TxBody.encode(decoded.body).finish(),
        authInfoBytes: tx_1.AuthInfo.encode(decoded.authInfo).finish(),
        signatures: [(0, encoding_1.fromBase64)(decoded.signatures.map(ss => (0, encoding_1.toBase64)(ss)).pop())],
    });
    return txBytesAssembled;
};
exports.assembleTxRawFromHumanRead = assembleTxRawFromHumanRead;
const assembleTxRawFromTx = (tx) => {
    const txR = tx_1.TxRaw.fromPartial({
        bodyBytes: tx_1.TxBody.encode(tx.body).finish(),
        authInfoBytes: tx_1.AuthInfo.encode(tx.authInfo).finish(),
        signatures: tx.signatures.map(ss => ss),
    });
    // console.log('assembleTxRawFromTx txRaw', txR);
    return txR;
};
exports.assembleTxRawFromTx = assembleTxRawFromTx;
const assembleTxFromString = (txString) => {
    const parsedObject = JSON.parse(txString);
    // console.log('parsedObject', parsedObject);
    const tx = tx_1.Tx.fromJSON(parsedObject);
    return tx;
};
exports.assembleTxFromString = assembleTxFromString;
const assembleTxRawFromString = (txRawString) => {
    const tx = (0, exports.assembleTxFromString)(txRawString);
    const txR = (0, exports.assembleTxRawFromTx)(tx);
    return txR;
};
exports.assembleTxRawFromString = assembleTxRawFromString;
const encodeTxHrToTx = async (jsonizedTx) => {
    const client = await (0, cosmos_1.getCosmos)();
    // const txBodyObject = txD.body!;
    const encodedMessages = await client.encodeMessagesFromTheTxBody(jsonizedTx.body.messages);
    (0, helpers_1.dirLog)('from encodeTxHrToTx encodedMessages', encodedMessages);
    if (encodedMessages) {
        jsonizedTx.body.messages = encodedMessages;
    }
    // const myTx = { body: txBodyObject, authInfo: txD.authInfo, signatures: txD.signatures };
    // myTx.body['messages'] = encodedMessages;
    // dirLog('from encodeTxHrToTx myTx', myTx);
    const encoded = tx_1.Tx.fromJSON(jsonizedTx);
    (0, helpers_1.dirLog)('from encodeTxHrToTx encoded', encoded);
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
    (0, helpers_1.dirLog)('from decodeTxRawToTx decoded', decoded);
    return decoded;
};
exports.decodeTxRawToTx = decodeTxRawToTx;
const decodeTxRawToTxHr = async (signedTx) => {
    var _a;
    const client = await (0, cosmos_1.getCosmos)();
    const decoded = (0, exports.decodeTxRawToTx)(signedTx);
    const jsonizedTx = tx_1.Tx.toJSON(decoded);
    (0, helpers_1.dirLog)('from decodeTxRawToHr jsonizedTx ', jsonizedTx);
    // const txBodyObject = decoded.body!;
    // hex string with the value
    // const encodedTxBodyObject = TxBody.toJSON(txBodyObject) as TxBody;
    const decodedMessages = await client.decodeMessagesFromTheTxBody((_a = decoded.body) === null || _a === void 0 ? void 0 : _a.messages);
    if (decodedMessages) {
        jsonizedTx.body.messages = decodedMessages;
    }
    // const txD = Tx.toJSON(decoded) as Tx;
    // if (decodedMessages) {
    //   txD.body!['messages'] = decodedMessages;
    // }
    (0, helpers_1.dirLog)('from decodeTxRawToHr jsonizedTx modified ', jsonizedTx);
    return jsonizedTx;
};
exports.decodeTxRawToTxHr = decodeTxRawToTxHr;
const decodeEncodedTxToHumanRead = (txBytes) => {
    const decoded = (0, proto_signing_1.decodeTxRaw)(txBytes);
    return decoded;
};
exports.decodeEncodedTxToHumanRead = decodeEncodedTxToHumanRead;
const encodeTxRawToEncodedTx = (signedTx) => {
    const txBytes = tx_1.TxRaw.encode(signedTx).finish();
    return txBytes;
};
exports.encodeTxRawToEncodedTx = encodeTxRawToEncodedTx;
const broadcast = async (signedTx) => {
    try {
        const client = await (0, cosmos_1.getCosmos)();
        // log('signedTx to be broadcasted', signedTx);
        // const txBytes = TxRaw.encode(signedTx).finish();
        const txBytes = (0, exports.encodeTxRawToEncodedTx)(signedTx);
        // log('encoded tx txBytes', txBytes);
        const result = await client.broadcastTx(txBytes);
        return result;
    }
    catch (err) {
        (0, helpers_1.dirLog)('Could not broadcast', err.message);
        throw err;
    }
};
exports.broadcast = broadcast;
const getStandardDefaultFee = () => {
    const gas = tokens_1.baseGasAmount + tokens_1.perMsgGasAmount; // i.e. 500_000 + 100_000 * 1 = 600_000_000_000gas
    // for min gas price in the chain of 0.01gwei/10_000_000wei and 600_000gas, the fee would be 6_000gwei / 6_000_000_000_000wei
    // for min gas price in tropos-5 of 1gwei/1_000_000_000wei and 600_000gas, the fee would be 600_000gwei / 600_000_000_000_000wei, or 0.006stos
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
    // dirLog('from getStandardFee txMessages', txMessages);
    if (txMessages.length > maxMessagesPerTx) {
        throw new Error(`Exceed max messages for fee calculation (got: ${txMessages.length}, limit: ${maxMessagesPerTx})`);
    }
    try {
        const client = await (0, cosmos_1.getCosmos)();
        const gas = await client.simulate(signerAddress, txMessages, '');
        const estimatedGas = Math.round(gas * tokens_1.gasAdjustment);
        const amount = tokens_1.minGasPrice.mul(estimatedGas).toString();
        const feeAmount = [{ amount, denom: hdVault_1.stratosDenom }];
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
    // const fee = givenFee ? givenFee : getStandardDefaultFee();
    const client = await (0, cosmos_1.getCosmos)();
    const signedTx = await client.sign(address, txMessages, fee, memo);
    // const txBytes = encodeTxRawToEncodedTx(signedTx);
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
    const payloadToProcess = payloadGenerator(withdrawalPayload.map((item) => ({
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
                beneficiary: senderAddress,
                // NOTE: this is still coins on tropos and it is amount on devnet
                // coins: getStandardAmount([amount]),
                amount: (0, exports.getStandardAmount)([amount]),
            },
        };
        (0, helpers_1.dirLog)('sds prepay message to be signed', message);
        messagesList.push(message);
        iteratedData = payloadToProcess.next();
    }
    return messagesList;
};
exports.getSdsPrepayTx = getSdsPrepayTx;
//# sourceMappingURL=transactions.js.map