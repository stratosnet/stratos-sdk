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
exports.getSdsPrepayTx = void 0;
const transactionsCommon = __importStar(require("../../common/transactions"));
const helpers_1 = require("../../services/helpers");
const Types = __importStar(require("./types"));
const getSdsPrepayTx = async (senderAddress, prepayPayload) => {
    const payloadToProcess = transactionsCommon.payloadGenerator(prepayPayload);
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
                amount: transactionsCommon.getStandardAmount([amount]),
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