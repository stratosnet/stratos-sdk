"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPagination = exports.isOldBalanceVersion = exports.isNewBalanceVersion = void 0;
const isNewBalanceVersion = (response) => {
    return 'balances' in response;
};
exports.isNewBalanceVersion = isNewBalanceVersion;
const isOldBalanceVersion = (response) => {
    return 'result' in response;
};
exports.isOldBalanceVersion = isOldBalanceVersion;
const isValidPagination = (pagination) => {
    return !!pagination && 'total' in pagination;
};
exports.isValidPagination = isValidPagination;
//# sourceMappingURL=apiUtils.js.map