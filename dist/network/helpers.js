"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPagination = exports.isOldBalanceVersion = exports.isNewBalanceVersion = exports.getNewProtocolFlag = void 0;
const getNewProtocolFlag = (currentVersion, minRequiredNewVersion) => {
    console.log('current protocol version ', currentVersion);
    const [pVer, pSubVer, pPatch] = currentVersion.split('.');
    const [minVer, minSubVer, minPatch] = minRequiredNewVersion.split('.');
    const isVerOld = +pVer < +minVer;
    const isSubVerOld = +pSubVer < +minSubVer;
    const isPatchOld = +pPatch < +minPatch;
    const isOldProtocol = isVerOld && isSubVerOld && isPatchOld;
    return !isOldProtocol;
};
exports.getNewProtocolFlag = getNewProtocolFlag;
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
//# sourceMappingURL=helpers.js.map