"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payloadGenerator = exports.getStandardAmount = void 0;
const hdVault_1 = require("../config/hdVault");
const tokens_1 = require("../config/tokens");
const bigNumber_1 = require("../services/bigNumber");
const getStandardAmount = (amounts) => {
    const result = amounts.map(amount => ({
        amount: (0, bigNumber_1.toWei)(amount, tokens_1.decimalPrecision).toFixed(),
        denom: hdVault_1.stratosDenom,
    }));
    return result;
};
exports.getStandardAmount = getStandardAmount;
function* payloadGenerator(dataList) {
    while (dataList.length) {
        yield dataList.shift();
    }
}
exports.payloadGenerator = payloadGenerator;
//# sourceMappingURL=transactions.js.map