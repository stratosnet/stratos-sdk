"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgClientImpl = exports.MsgEthereumTxResponse = exports.ExtensionOptionsEthereumTx = exports.DynamicFeeTx = exports.AccessListTx = exports.LegacyTx = exports.MsgEthereumTx = exports.protobufPackage = void 0;
/* eslint-disable */
const any_1 = require("cosmjs-types/google/protobuf/any");
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const evm_1 = require("./evm");
exports.protobufPackage = 'stratos.evm.v1';
function createBaseMsgEthereumTx() {
    return { data: undefined, size: 0, hash: '', from: '' };
}
exports.MsgEthereumTx = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.data !== undefined) {
            any_1.Any.encode(message.data, writer.uint32(10).fork()).ldelim();
        }
        if (message.size !== 0) {
            writer.uint32(17).double(message.size);
        }
        if (message.hash !== '') {
            writer.uint32(26).string(message.hash);
        }
        if (message.from !== '') {
            writer.uint32(34).string(message.from);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgEthereumTx();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.data = any_1.Any.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.size = reader.double();
                    break;
                case 3:
                    message.hash = reader.string();
                    break;
                case 4:
                    message.from = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            data: isSet(object.data) ? any_1.Any.fromJSON(object.data) : undefined,
            size: isSet(object.size) ? Number(object.size) : 0,
            hash: isSet(object.hash) ? String(object.hash) : '',
            from: isSet(object.from) ? String(object.from) : '',
        };
    },
    toJSON(message) {
        const obj = {};
        message.data !== undefined && (obj.data = message.data ? any_1.Any.toJSON(message.data) : undefined);
        message.size !== undefined && (obj.size = message.size);
        message.hash !== undefined && (obj.hash = message.hash);
        message.from !== undefined && (obj.from = message.from);
        return obj;
    },
    create(base) {
        return exports.MsgEthereumTx.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c;
        const message = createBaseMsgEthereumTx();
        message.data =
            object.data !== undefined && object.data !== null ? any_1.Any.fromPartial(object.data) : undefined;
        message.size = (_a = object.size) !== null && _a !== void 0 ? _a : 0;
        message.hash = (_b = object.hash) !== null && _b !== void 0 ? _b : '';
        message.from = (_c = object.from) !== null && _c !== void 0 ? _c : '';
        return message;
    },
};
function createBaseLegacyTx() {
    return {
        nonce: 0,
        gasPrice: '',
        gas: 0,
        to: '',
        value: '',
        data: new Uint8Array(),
        v: new Uint8Array(),
        r: new Uint8Array(),
        s: new Uint8Array(),
    };
}
exports.LegacyTx = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.nonce !== 0) {
            writer.uint32(8).uint64(message.nonce);
        }
        if (message.gasPrice !== '') {
            writer.uint32(18).string(message.gasPrice);
        }
        if (message.gas !== 0) {
            writer.uint32(24).uint64(message.gas);
        }
        if (message.to !== '') {
            writer.uint32(34).string(message.to);
        }
        if (message.value !== '') {
            writer.uint32(42).string(message.value);
        }
        if (message.data.length !== 0) {
            writer.uint32(50).bytes(message.data);
        }
        if (message.v.length !== 0) {
            writer.uint32(58).bytes(message.v);
        }
        if (message.r.length !== 0) {
            writer.uint32(66).bytes(message.r);
        }
        if (message.s.length !== 0) {
            writer.uint32(74).bytes(message.s);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLegacyTx();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.nonce = longToNumber(reader.uint64());
                    break;
                case 2:
                    message.gasPrice = reader.string();
                    break;
                case 3:
                    message.gas = longToNumber(reader.uint64());
                    break;
                case 4:
                    message.to = reader.string();
                    break;
                case 5:
                    message.value = reader.string();
                    break;
                case 6:
                    message.data = reader.bytes();
                    break;
                case 7:
                    message.v = reader.bytes();
                    break;
                case 8:
                    message.r = reader.bytes();
                    break;
                case 9:
                    message.s = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            nonce: isSet(object.nonce) ? Number(object.nonce) : 0,
            gasPrice: isSet(object.gasPrice) ? String(object.gasPrice) : '',
            gas: isSet(object.gas) ? Number(object.gas) : 0,
            to: isSet(object.to) ? String(object.to) : '',
            value: isSet(object.value) ? String(object.value) : '',
            data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
            v: isSet(object.v) ? bytesFromBase64(object.v) : new Uint8Array(),
            r: isSet(object.r) ? bytesFromBase64(object.r) : new Uint8Array(),
            s: isSet(object.s) ? bytesFromBase64(object.s) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.nonce !== undefined && (obj.nonce = Math.round(message.nonce));
        message.gasPrice !== undefined && (obj.gasPrice = message.gasPrice);
        message.gas !== undefined && (obj.gas = Math.round(message.gas));
        message.to !== undefined && (obj.to = message.to);
        message.value !== undefined && (obj.value = message.value);
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        message.v !== undefined &&
            (obj.v = base64FromBytes(message.v !== undefined ? message.v : new Uint8Array()));
        message.r !== undefined &&
            (obj.r = base64FromBytes(message.r !== undefined ? message.r : new Uint8Array()));
        message.s !== undefined &&
            (obj.s = base64FromBytes(message.s !== undefined ? message.s : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.LegacyTx.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const message = createBaseLegacyTx();
        message.nonce = (_a = object.nonce) !== null && _a !== void 0 ? _a : 0;
        message.gasPrice = (_b = object.gasPrice) !== null && _b !== void 0 ? _b : '';
        message.gas = (_c = object.gas) !== null && _c !== void 0 ? _c : 0;
        message.to = (_d = object.to) !== null && _d !== void 0 ? _d : '';
        message.value = (_e = object.value) !== null && _e !== void 0 ? _e : '';
        message.data = (_f = object.data) !== null && _f !== void 0 ? _f : new Uint8Array();
        message.v = (_g = object.v) !== null && _g !== void 0 ? _g : new Uint8Array();
        message.r = (_h = object.r) !== null && _h !== void 0 ? _h : new Uint8Array();
        message.s = (_j = object.s) !== null && _j !== void 0 ? _j : new Uint8Array();
        return message;
    },
};
function createBaseAccessListTx() {
    return {
        chainId: '',
        nonce: 0,
        gasPrice: '',
        gas: 0,
        to: '',
        value: '',
        data: new Uint8Array(),
        accesses: [],
        v: new Uint8Array(),
        r: new Uint8Array(),
        s: new Uint8Array(),
    };
}
exports.AccessListTx = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.chainId !== '') {
            writer.uint32(10).string(message.chainId);
        }
        if (message.nonce !== 0) {
            writer.uint32(16).uint64(message.nonce);
        }
        if (message.gasPrice !== '') {
            writer.uint32(26).string(message.gasPrice);
        }
        if (message.gas !== 0) {
            writer.uint32(32).uint64(message.gas);
        }
        if (message.to !== '') {
            writer.uint32(42).string(message.to);
        }
        if (message.value !== '') {
            writer.uint32(50).string(message.value);
        }
        if (message.data.length !== 0) {
            writer.uint32(58).bytes(message.data);
        }
        for (const v of message.accesses) {
            evm_1.AccessTuple.encode(v, writer.uint32(66).fork()).ldelim();
        }
        if (message.v.length !== 0) {
            writer.uint32(74).bytes(message.v);
        }
        if (message.r.length !== 0) {
            writer.uint32(82).bytes(message.r);
        }
        if (message.s.length !== 0) {
            writer.uint32(90).bytes(message.s);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAccessListTx();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.chainId = reader.string();
                    break;
                case 2:
                    message.nonce = longToNumber(reader.uint64());
                    break;
                case 3:
                    message.gasPrice = reader.string();
                    break;
                case 4:
                    message.gas = longToNumber(reader.uint64());
                    break;
                case 5:
                    message.to = reader.string();
                    break;
                case 6:
                    message.value = reader.string();
                    break;
                case 7:
                    message.data = reader.bytes();
                    break;
                case 8:
                    message.accesses.push(evm_1.AccessTuple.decode(reader, reader.uint32()));
                    break;
                case 9:
                    message.v = reader.bytes();
                    break;
                case 10:
                    message.r = reader.bytes();
                    break;
                case 11:
                    message.s = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            chainId: isSet(object.chainId) ? String(object.chainId) : '',
            nonce: isSet(object.nonce) ? Number(object.nonce) : 0,
            gasPrice: isSet(object.gasPrice) ? String(object.gasPrice) : '',
            gas: isSet(object.gas) ? Number(object.gas) : 0,
            to: isSet(object.to) ? String(object.to) : '',
            value: isSet(object.value) ? String(object.value) : '',
            data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
            accesses: Array.isArray(object === null || object === void 0 ? void 0 : object.accesses)
                ? object.accesses.map((e) => evm_1.AccessTuple.fromJSON(e))
                : [],
            v: isSet(object.v) ? bytesFromBase64(object.v) : new Uint8Array(),
            r: isSet(object.r) ? bytesFromBase64(object.r) : new Uint8Array(),
            s: isSet(object.s) ? bytesFromBase64(object.s) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.chainId !== undefined && (obj.chainId = message.chainId);
        message.nonce !== undefined && (obj.nonce = Math.round(message.nonce));
        message.gasPrice !== undefined && (obj.gasPrice = message.gasPrice);
        message.gas !== undefined && (obj.gas = Math.round(message.gas));
        message.to !== undefined && (obj.to = message.to);
        message.value !== undefined && (obj.value = message.value);
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        if (message.accesses) {
            obj.accesses = message.accesses.map(e => (e ? evm_1.AccessTuple.toJSON(e) : undefined));
        }
        else {
            obj.accesses = [];
        }
        message.v !== undefined &&
            (obj.v = base64FromBytes(message.v !== undefined ? message.v : new Uint8Array()));
        message.r !== undefined &&
            (obj.r = base64FromBytes(message.r !== undefined ? message.r : new Uint8Array()));
        message.s !== undefined &&
            (obj.s = base64FromBytes(message.s !== undefined ? message.s : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.AccessListTx.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const message = createBaseAccessListTx();
        message.chainId = (_a = object.chainId) !== null && _a !== void 0 ? _a : '';
        message.nonce = (_b = object.nonce) !== null && _b !== void 0 ? _b : 0;
        message.gasPrice = (_c = object.gasPrice) !== null && _c !== void 0 ? _c : '';
        message.gas = (_d = object.gas) !== null && _d !== void 0 ? _d : 0;
        message.to = (_e = object.to) !== null && _e !== void 0 ? _e : '';
        message.value = (_f = object.value) !== null && _f !== void 0 ? _f : '';
        message.data = (_g = object.data) !== null && _g !== void 0 ? _g : new Uint8Array();
        message.accesses = ((_h = object.accesses) === null || _h === void 0 ? void 0 : _h.map(e => evm_1.AccessTuple.fromPartial(e))) || [];
        message.v = (_j = object.v) !== null && _j !== void 0 ? _j : new Uint8Array();
        message.r = (_k = object.r) !== null && _k !== void 0 ? _k : new Uint8Array();
        message.s = (_l = object.s) !== null && _l !== void 0 ? _l : new Uint8Array();
        return message;
    },
};
function createBaseDynamicFeeTx() {
    return {
        chainId: '',
        nonce: 0,
        gasTipCap: '',
        gasFeeCap: '',
        gas: 0,
        to: '',
        value: '',
        data: new Uint8Array(),
        accesses: [],
        v: new Uint8Array(),
        r: new Uint8Array(),
        s: new Uint8Array(),
    };
}
exports.DynamicFeeTx = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.chainId !== '') {
            writer.uint32(10).string(message.chainId);
        }
        if (message.nonce !== 0) {
            writer.uint32(16).uint64(message.nonce);
        }
        if (message.gasTipCap !== '') {
            writer.uint32(26).string(message.gasTipCap);
        }
        if (message.gasFeeCap !== '') {
            writer.uint32(34).string(message.gasFeeCap);
        }
        if (message.gas !== 0) {
            writer.uint32(40).uint64(message.gas);
        }
        if (message.to !== '') {
            writer.uint32(50).string(message.to);
        }
        if (message.value !== '') {
            writer.uint32(58).string(message.value);
        }
        if (message.data.length !== 0) {
            writer.uint32(66).bytes(message.data);
        }
        for (const v of message.accesses) {
            evm_1.AccessTuple.encode(v, writer.uint32(74).fork()).ldelim();
        }
        if (message.v.length !== 0) {
            writer.uint32(82).bytes(message.v);
        }
        if (message.r.length !== 0) {
            writer.uint32(90).bytes(message.r);
        }
        if (message.s.length !== 0) {
            writer.uint32(98).bytes(message.s);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDynamicFeeTx();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.chainId = reader.string();
                    break;
                case 2:
                    message.nonce = longToNumber(reader.uint64());
                    break;
                case 3:
                    message.gasTipCap = reader.string();
                    break;
                case 4:
                    message.gasFeeCap = reader.string();
                    break;
                case 5:
                    message.gas = longToNumber(reader.uint64());
                    break;
                case 6:
                    message.to = reader.string();
                    break;
                case 7:
                    message.value = reader.string();
                    break;
                case 8:
                    message.data = reader.bytes();
                    break;
                case 9:
                    message.accesses.push(evm_1.AccessTuple.decode(reader, reader.uint32()));
                    break;
                case 10:
                    message.v = reader.bytes();
                    break;
                case 11:
                    message.r = reader.bytes();
                    break;
                case 12:
                    message.s = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            chainId: isSet(object.chainId) ? String(object.chainId) : '',
            nonce: isSet(object.nonce) ? Number(object.nonce) : 0,
            gasTipCap: isSet(object.gasTipCap) ? String(object.gasTipCap) : '',
            gasFeeCap: isSet(object.gasFeeCap) ? String(object.gasFeeCap) : '',
            gas: isSet(object.gas) ? Number(object.gas) : 0,
            to: isSet(object.to) ? String(object.to) : '',
            value: isSet(object.value) ? String(object.value) : '',
            data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
            accesses: Array.isArray(object === null || object === void 0 ? void 0 : object.accesses)
                ? object.accesses.map((e) => evm_1.AccessTuple.fromJSON(e))
                : [],
            v: isSet(object.v) ? bytesFromBase64(object.v) : new Uint8Array(),
            r: isSet(object.r) ? bytesFromBase64(object.r) : new Uint8Array(),
            s: isSet(object.s) ? bytesFromBase64(object.s) : new Uint8Array(),
        };
    },
    toJSON(message) {
        const obj = {};
        message.chainId !== undefined && (obj.chainId = message.chainId);
        message.nonce !== undefined && (obj.nonce = Math.round(message.nonce));
        message.gasTipCap !== undefined && (obj.gasTipCap = message.gasTipCap);
        message.gasFeeCap !== undefined && (obj.gasFeeCap = message.gasFeeCap);
        message.gas !== undefined && (obj.gas = Math.round(message.gas));
        message.to !== undefined && (obj.to = message.to);
        message.value !== undefined && (obj.value = message.value);
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        if (message.accesses) {
            obj.accesses = message.accesses.map(e => (e ? evm_1.AccessTuple.toJSON(e) : undefined));
        }
        else {
            obj.accesses = [];
        }
        message.v !== undefined &&
            (obj.v = base64FromBytes(message.v !== undefined ? message.v : new Uint8Array()));
        message.r !== undefined &&
            (obj.r = base64FromBytes(message.r !== undefined ? message.r : new Uint8Array()));
        message.s !== undefined &&
            (obj.s = base64FromBytes(message.s !== undefined ? message.s : new Uint8Array()));
        return obj;
    },
    create(base) {
        return exports.DynamicFeeTx.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const message = createBaseDynamicFeeTx();
        message.chainId = (_a = object.chainId) !== null && _a !== void 0 ? _a : '';
        message.nonce = (_b = object.nonce) !== null && _b !== void 0 ? _b : 0;
        message.gasTipCap = (_c = object.gasTipCap) !== null && _c !== void 0 ? _c : '';
        message.gasFeeCap = (_d = object.gasFeeCap) !== null && _d !== void 0 ? _d : '';
        message.gas = (_e = object.gas) !== null && _e !== void 0 ? _e : 0;
        message.to = (_f = object.to) !== null && _f !== void 0 ? _f : '';
        message.value = (_g = object.value) !== null && _g !== void 0 ? _g : '';
        message.data = (_h = object.data) !== null && _h !== void 0 ? _h : new Uint8Array();
        message.accesses = ((_j = object.accesses) === null || _j === void 0 ? void 0 : _j.map(e => evm_1.AccessTuple.fromPartial(e))) || [];
        message.v = (_k = object.v) !== null && _k !== void 0 ? _k : new Uint8Array();
        message.r = (_l = object.r) !== null && _l !== void 0 ? _l : new Uint8Array();
        message.s = (_m = object.s) !== null && _m !== void 0 ? _m : new Uint8Array();
        return message;
    },
};
function createBaseExtensionOptionsEthereumTx() {
    return {};
}
exports.ExtensionOptionsEthereumTx = {
    encode(_, writer = minimal_1.default.Writer.create()) {
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseExtensionOptionsEthereumTx();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(_) {
        return {};
    },
    toJSON(_) {
        const obj = {};
        return obj;
    },
    create(base) {
        return exports.ExtensionOptionsEthereumTx.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(_) {
        const message = createBaseExtensionOptionsEthereumTx();
        return message;
    },
};
function createBaseMsgEthereumTxResponse() {
    return { hash: '', logs: [], ret: new Uint8Array(), vmError: '', gasUsed: 0 };
}
exports.MsgEthereumTxResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.hash !== '') {
            writer.uint32(10).string(message.hash);
        }
        for (const v of message.logs) {
            evm_1.Log.encode(v, writer.uint32(18).fork()).ldelim();
        }
        if (message.ret.length !== 0) {
            writer.uint32(26).bytes(message.ret);
        }
        if (message.vmError !== '') {
            writer.uint32(34).string(message.vmError);
        }
        if (message.gasUsed !== 0) {
            writer.uint32(40).uint64(message.gasUsed);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMsgEthereumTxResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.hash = reader.string();
                    break;
                case 2:
                    message.logs.push(evm_1.Log.decode(reader, reader.uint32()));
                    break;
                case 3:
                    message.ret = reader.bytes();
                    break;
                case 4:
                    message.vmError = reader.string();
                    break;
                case 5:
                    message.gasUsed = longToNumber(reader.uint64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            hash: isSet(object.hash) ? String(object.hash) : '',
            logs: Array.isArray(object === null || object === void 0 ? void 0 : object.logs) ? object.logs.map((e) => evm_1.Log.fromJSON(e)) : [],
            ret: isSet(object.ret) ? bytesFromBase64(object.ret) : new Uint8Array(),
            vmError: isSet(object.vmError) ? String(object.vmError) : '',
            gasUsed: isSet(object.gasUsed) ? Number(object.gasUsed) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.hash !== undefined && (obj.hash = message.hash);
        if (message.logs) {
            obj.logs = message.logs.map(e => (e ? evm_1.Log.toJSON(e) : undefined));
        }
        else {
            obj.logs = [];
        }
        message.ret !== undefined &&
            (obj.ret = base64FromBytes(message.ret !== undefined ? message.ret : new Uint8Array()));
        message.vmError !== undefined && (obj.vmError = message.vmError);
        message.gasUsed !== undefined && (obj.gasUsed = Math.round(message.gasUsed));
        return obj;
    },
    create(base) {
        return exports.MsgEthereumTxResponse.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseMsgEthereumTxResponse();
        message.hash = (_a = object.hash) !== null && _a !== void 0 ? _a : '';
        message.logs = ((_b = object.logs) === null || _b === void 0 ? void 0 : _b.map(e => evm_1.Log.fromPartial(e))) || [];
        message.ret = (_c = object.ret) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.vmError = (_d = object.vmError) !== null && _d !== void 0 ? _d : '';
        message.gasUsed = (_e = object.gasUsed) !== null && _e !== void 0 ? _e : 0;
        return message;
    },
};
class MsgClientImpl {
    constructor(rpc, opts) {
        this.service = (opts === null || opts === void 0 ? void 0 : opts.service) || 'stratos.evm.v1.Msg';
        this.rpc = rpc;
        this.EthereumTx = this.EthereumTx.bind(this);
    }
    EthereumTx(request) {
        const data = exports.MsgEthereumTx.encode(request).finish();
        const promise = this.rpc.request(this.service, 'EthereumTx', data);
        return promise.then(data => exports.MsgEthereumTxResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.MsgClientImpl = MsgClientImpl;
var tsProtoGlobalThis = (() => {
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    throw 'Unable to locate global object';
})();
function bytesFromBase64(b64) {
    if (tsProtoGlobalThis.Buffer) {
        return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, 'base64'));
    }
    else {
        const bin = tsProtoGlobalThis.atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; ++i) {
            arr[i] = bin.charCodeAt(i);
        }
        return arr;
    }
}
function base64FromBytes(arr) {
    if (tsProtoGlobalThis.Buffer) {
        return tsProtoGlobalThis.Buffer.from(arr).toString('base64');
    }
    else {
        const bin = [];
        arr.forEach(byte => {
            bin.push(String.fromCharCode(byte));
        });
        return tsProtoGlobalThis.btoa(bin.join(''));
    }
}
function longToNumber(long) {
    if (long.gt(Number.MAX_SAFE_INTEGER)) {
        throw new tsProtoGlobalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER');
    }
    return long.toNumber();
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=tx.js.map