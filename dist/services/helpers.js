"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.wait = exports.log = exports.now = void 0;
const now = () => new Date().toLocaleString();
exports.now = now;
const log = (message, ...rest) => {
    console.log(`"${(0, exports.now)()}" - ${message}`, (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '');
};
exports.log = log;
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
//# sourceMappingURL=helpers.js.map