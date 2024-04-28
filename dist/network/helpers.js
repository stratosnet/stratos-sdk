"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewProtocolFlag = void 0;
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
//# sourceMappingURL=helpers.js.map