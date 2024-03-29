"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBuffer = exports.toArrayBuffer = exports.getNewProtocolFlag = exports.getCurrentTimestamp = exports.getTimestampInSeconds = exports.delay = exports.wait = exports.dirLog = exports.log = exports.now = void 0;
const now = () => new Date().toLocaleString();
exports.now = now;
// NOTE - did log for console output -
// use -> console.dir(result, { depth: null, colors: true, maxArrayLength: null });
const log = (message, ...rest) => {
    console.log(`"${(0, exports.now)()}" - ${message}`, (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '');
};
exports.log = log;
const dirLog = (message, ...rest) => {
    const opts = { depth: null, colors: true, maxArrayLength: null };
    const otherData = (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '';
    const data = { messageTime: `"${(0, exports.now)()}" - ${message}`, message, otherData };
    console.dir(data, opts);
};
exports.dirLog = dirLog;
async function wait(fn, ms) {
    while (!fn()) {
        await delay(ms);
    }
}
exports.wait = wait;
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.delay = delay;
function getTimestampInSeconds() {
    return Math.floor(Date.now() / 1000);
}
exports.getTimestampInSeconds = getTimestampInSeconds;
function getCurrentTimestamp() {
    return Date.now();
}
exports.getCurrentTimestamp = getCurrentTimestamp;
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
function toArrayBuffer(buffer) {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
}
exports.toArrayBuffer = toArrayBuffer;
function toBuffer(arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
}
exports.toBuffer = toBuffer;
//# sourceMappingURL=helpers.js.map