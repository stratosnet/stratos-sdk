"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentSequenceString = void 0;
const accounts_1 = require("../../accounts");
const getCurrentSequenceString = async (address) => {
    const ozoneBalance = await accounts_1.accountsApi.getOtherBalanceCardMetrics(address);
    const { detailedBalance } = ozoneBalance;
    if (!detailedBalance) {
        throw new Error('no sequence is presented in the ozone balance response');
    }
    const { sequence } = detailedBalance;
    return `${sequence ? sequence : ''}`;
};
exports.getCurrentSequenceString = getCurrentSequenceString;
//# sourceMappingURL=remoteCommon.js.map