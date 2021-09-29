"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToString = exports.stringToHex = exports.uint8ArrayToBase64str = exports.uint8ArrayToBuffer = exports.uint8arrayToHexStr = exports.bufferToUint8Array = exports.bufferToHexStr = exports.hexStrToUint8Array = exports.hexStrToBuffer = void 0;
var tweetnacl_util_1 = __importDefault(require("tweetnacl-util"));
var hexStrToBuffer = function (input) { return Buffer.from(input, 'hex'); };
exports.hexStrToBuffer = hexStrToBuffer;
var hexStrToUint8Array = function (input) { return Uint8Array.from(Buffer.from(input, 'hex')); };
exports.hexStrToUint8Array = hexStrToUint8Array;
var bufferToHexStr = function (input) { return input.toString('hex'); };
exports.bufferToHexStr = bufferToHexStr;
var bufferToUint8Array = function (input) { return Uint8Array.from(input); };
exports.bufferToUint8Array = bufferToUint8Array;
var uint8arrayToHexStr = function (input) { return Buffer.from(input).toString('hex'); };
exports.uint8arrayToHexStr = uint8arrayToHexStr;
var uint8ArrayToBuffer = function (input) { return (0, exports.hexStrToBuffer)((0, exports.uint8arrayToHexStr)(input)); };
exports.uint8ArrayToBuffer = uint8ArrayToBuffer;
var uint8ArrayToBase64str = function (input) { return tweetnacl_util_1.default.encodeBase64(input); };
exports.uint8ArrayToBase64str = uint8ArrayToBase64str;
var stringToHex = function (input) { return Buffer.from(input, 'utf8').toString('hex'); };
exports.stringToHex = stringToHex;
var hexToString = function (input) { return Buffer.from(input, 'hex').toString('utf-8'); };
exports.hexToString = hexToString;
//# sourceMappingURL=utils.js.map