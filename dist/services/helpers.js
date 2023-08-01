"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTimestamp = exports.getTimestampInSeconds = exports.delay = exports.wait = exports.dirLog = exports.log = exports.now = void 0;
const now = () => new Date().toLocaleString();
exports.now = now;
// NOTE - did log for console output -
// use -> console.dir(result, { depth: null, colors: true, maxArrayLength: null });
const log = (message, ...rest) => {
    console.log(`"${(0, exports.now)()}" - ${message} `, (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '');
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
//# sourceMappingURL=helpers.js.map