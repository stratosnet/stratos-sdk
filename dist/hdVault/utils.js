"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeUint8Arrays = exports.hexToString = exports.stringToHex = exports.uint8ArrayToBase64str = exports.uint8ArrayToBuffer = exports.uint8arrayToHexStr = exports.bufferToUint8Array = exports.bufferToHexStr = exports.hexStrToUint8Array = exports.hexStrToBuffer = void 0;
const tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
const hexStrToBuffer = (input) => Buffer.from(input, 'hex');
exports.hexStrToBuffer = hexStrToBuffer;
const hexStrToUint8Array = (input) => Uint8Array.from(Buffer.from(input, 'hex'));
exports.hexStrToUint8Array = hexStrToUint8Array;
const bufferToHexStr = (input) => input.toString('hex');
exports.bufferToHexStr = bufferToHexStr;
const bufferToUint8Array = (input) => Uint8Array.from(input);
exports.bufferToUint8Array = bufferToUint8Array;
const uint8arrayToHexStr = (input) => Buffer.from(input).toString('hex');
exports.uint8arrayToHexStr = uint8arrayToHexStr;
const uint8ArrayToBuffer = (input) => (0, exports.hexStrToBuffer)((0, exports.uint8arrayToHexStr)(input));
exports.uint8ArrayToBuffer = uint8ArrayToBuffer;
const uint8ArrayToBase64str = (input) => tweetnacl_util_1.default.encodeBase64(input);
exports.uint8ArrayToBase64str = uint8ArrayToBase64str;
const stringToHex = (input) => Buffer.from(input, 'utf8').toString('hex');
exports.stringToHex = stringToHex;
const hexToString = (input) => Buffer.from(input, 'hex').toString('utf-8');
exports.hexToString = hexToString;
function mergeUint8Arrays(a1, a2) {
    // sum of individual array lengths
    const mergedArray = new Uint8Array(a1.length + a2.length);
    mergedArray.set(a1);
    mergedArray.set(a2, a1.length);
    return mergedArray;
}
exports.mergeUint8Arrays = mergeUint8Arrays;
//# sourceMappingURL=utils.js.map