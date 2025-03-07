"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDateTimeString = exports.uint8arrayToHumanString = exports.hexToBytes = exports.uint8arrayToBase64Str = exports.uint8arrayToHexStr = exports.base64StringToHumanString = exports.humanStringToBase64String = exports.hexStringToHumanString = exports.humanStringToHexString = exports.toBuffer = exports.toArrayBuffer = exports.getCurrentTimestamp = exports.getTimestampInSeconds = exports.delay = exports.wait = exports.dirLog = exports.log = exports.now = void 0;
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
const humanStringToHexString = (input) => Buffer.from(input).toString('hex');
exports.humanStringToHexString = humanStringToHexString;
const hexStringToHumanString = (input) => Buffer.from(input, 'hex').toString();
exports.hexStringToHumanString = hexStringToHumanString;
const humanStringToBase64String = (input) => Buffer.from(input).toString('base64');
exports.humanStringToBase64String = humanStringToBase64String;
const base64StringToHumanString = (input) => Buffer.from(input, 'base64').toString();
exports.base64StringToHumanString = base64StringToHumanString;
const uint8arrayToHexStr = (input) => Buffer.from(input).toString('hex');
exports.uint8arrayToHexStr = uint8arrayToHexStr;
const uint8arrayToBase64Str = (input) => Buffer.from(input).toString('base64');
exports.uint8arrayToBase64Str = uint8arrayToBase64Str;
const hexToBytes = (input) => new Uint8Array(Buffer.from(input, 'hex'));
exports.hexToBytes = hexToBytes;
const uint8arrayToHumanString = (input) => Buffer.from(input).toString();
exports.uint8arrayToHumanString = uint8arrayToHumanString;
// example - createDateTimeString("2025-12-25", "23:59:59") // "2025-12-25T23:59:59-05:00"
const createDateTimeString = (startLocalDate, startLocalTime) => {
    const formatNumber = (n) => n.toString().padStart(2, '0');
    const formatOffset = (date) => {
        const offset = date.getTimezoneOffset();
        const sign = offset > 0 ? '-' : '+';
        const hours = formatNumber(Math.floor(Math.abs(offset) / 60));
        const minutes = formatNumber(Math.abs(offset) % 60);
        return `${sign}${hours}:${minutes}`;
    };
    const dateObj = new Date();
    if (startLocalDate) {
        const [year, month, day] = startLocalDate.split('-').map(Number);
        dateObj.setFullYear(year, month - 1, day); // Months are 0-based
    }
    if (startLocalTime) {
        const [hours, minutes, seconds] = startLocalTime.split(':').map(Number);
        dateObj.setHours(hours, minutes, seconds || 0, 0);
    }
    return [
        [dateObj.getFullYear(), formatNumber(dateObj.getMonth() + 1), formatNumber(dateObj.getDate())].join('-'),
        'T',
        [
            formatNumber(dateObj.getHours()),
            formatNumber(dateObj.getMinutes()),
            formatNumber(dateObj.getSeconds()),
        ].join(':'),
        formatOffset(dateObj),
    ].join('');
};
exports.createDateTimeString = createDateTimeString;
//# sourceMappingURL=helpers.js.map