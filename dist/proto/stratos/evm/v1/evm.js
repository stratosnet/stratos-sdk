"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeeMarketParams = exports.TraceConfig = exports.AccessTuple = exports.TxResult = exports.Log = exports.TransactionLogs = exports.State = exports.ChainConfig = exports.Params = exports.protobufPackage = void 0;
/* eslint-disable */
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
exports.protobufPackage = 'stratos.evm.v1';
function createBaseParams() {
    return {
        evmDenom: '',
        enableCreate: false,
        enableCall: false,
        extraEips: [],
        chainConfig: undefined,
        feeMarketParams: undefined,
    };
}
exports.Params = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.evmDenom !== '') {
            writer.uint32(10).string(message.evmDenom);
        }
        if (message.enableCreate === true) {
            writer.uint32(16).bool(message.enableCreate);
        }
        if (message.enableCall === true) {
            writer.uint32(24).bool(message.enableCall);
        }
        writer.uint32(34).fork();
        for (const v of message.extraEips) {
            writer.int64(v);
        }
        writer.ldelim();
        if (message.chainConfig !== undefined) {
            exports.ChainConfig.encode(message.chainConfig, writer.uint32(42).fork()).ldelim();
        }
        if (message.feeMarketParams !== undefined) {
            exports.FeeMarketParams.encode(message.feeMarketParams, writer.uint32(50).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.evmDenom = reader.string();
                    break;
                case 2:
                    message.enableCreate = reader.bool();
                    break;
                case 3:
                    message.enableCall = reader.bool();
                    break;
                case 4:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.extraEips.push(longToNumber(reader.int64()));
                        }
                    }
                    else {
                        message.extraEips.push(longToNumber(reader.int64()));
                    }
                    break;
                case 5:
                    message.chainConfig = exports.ChainConfig.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.feeMarketParams = exports.FeeMarketParams.decode(reader, reader.uint32());
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
            evmDenom: isSet(object.evmDenom) ? String(object.evmDenom) : '',
            enableCreate: isSet(object.enableCreate) ? Boolean(object.enableCreate) : false,
            enableCall: isSet(object.enableCall) ? Boolean(object.enableCall) : false,
            extraEips: Array.isArray(object === null || object === void 0 ? void 0 : object.extraEips) ? object.extraEips.map((e) => Number(e)) : [],
            chainConfig: isSet(object.chainConfig) ? exports.ChainConfig.fromJSON(object.chainConfig) : undefined,
            feeMarketParams: isSet(object.feeMarketParams)
                ? exports.FeeMarketParams.fromJSON(object.feeMarketParams)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.evmDenom !== undefined && (obj.evmDenom = message.evmDenom);
        message.enableCreate !== undefined && (obj.enableCreate = message.enableCreate);
        message.enableCall !== undefined && (obj.enableCall = message.enableCall);
        if (message.extraEips) {
            obj.extraEips = message.extraEips.map(e => Math.round(e));
        }
        else {
            obj.extraEips = [];
        }
        message.chainConfig !== undefined &&
            (obj.chainConfig = message.chainConfig ? exports.ChainConfig.toJSON(message.chainConfig) : undefined);
        message.feeMarketParams !== undefined &&
            (obj.feeMarketParams = message.feeMarketParams
                ? exports.FeeMarketParams.toJSON(message.feeMarketParams)
                : undefined);
        return obj;
    },
    create(base) {
        return exports.Params.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d;
        const message = createBaseParams();
        message.evmDenom = (_a = object.evmDenom) !== null && _a !== void 0 ? _a : '';
        message.enableCreate = (_b = object.enableCreate) !== null && _b !== void 0 ? _b : false;
        message.enableCall = (_c = object.enableCall) !== null && _c !== void 0 ? _c : false;
        message.extraEips = ((_d = object.extraEips) === null || _d === void 0 ? void 0 : _d.map(e => e)) || [];
        message.chainConfig =
            object.chainConfig !== undefined && object.chainConfig !== null
                ? exports.ChainConfig.fromPartial(object.chainConfig)
                : undefined;
        message.feeMarketParams =
            object.feeMarketParams !== undefined && object.feeMarketParams !== null
                ? exports.FeeMarketParams.fromPartial(object.feeMarketParams)
                : undefined;
        return message;
    },
};
function createBaseChainConfig() {
    return {
        chainId: '',
        homesteadBlock: '',
        daoForkBlock: '',
        daoForkSupport: false,
        eip150Block: '',
        eip150Hash: '',
        eip155Block: '',
        eip158Block: '',
        byzantiumBlock: '',
        constantinopleBlock: '',
        petersburgBlock: '',
        istanbulBlock: '',
        muirGlacierBlock: '',
        berlinBlock: '',
        londonBlock: '',
        arrowGlacierBlock: '',
        mergeForkBlock: '',
    };
}
exports.ChainConfig = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.chainId !== '') {
            writer.uint32(10).string(message.chainId);
        }
        if (message.homesteadBlock !== '') {
            writer.uint32(18).string(message.homesteadBlock);
        }
        if (message.daoForkBlock !== '') {
            writer.uint32(26).string(message.daoForkBlock);
        }
        if (message.daoForkSupport === true) {
            writer.uint32(32).bool(message.daoForkSupport);
        }
        if (message.eip150Block !== '') {
            writer.uint32(42).string(message.eip150Block);
        }
        if (message.eip150Hash !== '') {
            writer.uint32(50).string(message.eip150Hash);
        }
        if (message.eip155Block !== '') {
            writer.uint32(58).string(message.eip155Block);
        }
        if (message.eip158Block !== '') {
            writer.uint32(66).string(message.eip158Block);
        }
        if (message.byzantiumBlock !== '') {
            writer.uint32(74).string(message.byzantiumBlock);
        }
        if (message.constantinopleBlock !== '') {
            writer.uint32(82).string(message.constantinopleBlock);
        }
        if (message.petersburgBlock !== '') {
            writer.uint32(90).string(message.petersburgBlock);
        }
        if (message.istanbulBlock !== '') {
            writer.uint32(98).string(message.istanbulBlock);
        }
        if (message.muirGlacierBlock !== '') {
            writer.uint32(106).string(message.muirGlacierBlock);
        }
        if (message.berlinBlock !== '') {
            writer.uint32(114).string(message.berlinBlock);
        }
        if (message.londonBlock !== '') {
            writer.uint32(146).string(message.londonBlock);
        }
        if (message.arrowGlacierBlock !== '') {
            writer.uint32(154).string(message.arrowGlacierBlock);
        }
        if (message.mergeForkBlock !== '') {
            writer.uint32(162).string(message.mergeForkBlock);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseChainConfig();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.chainId = reader.string();
                    break;
                case 2:
                    message.homesteadBlock = reader.string();
                    break;
                case 3:
                    message.daoForkBlock = reader.string();
                    break;
                case 4:
                    message.daoForkSupport = reader.bool();
                    break;
                case 5:
                    message.eip150Block = reader.string();
                    break;
                case 6:
                    message.eip150Hash = reader.string();
                    break;
                case 7:
                    message.eip155Block = reader.string();
                    break;
                case 8:
                    message.eip158Block = reader.string();
                    break;
                case 9:
                    message.byzantiumBlock = reader.string();
                    break;
                case 10:
                    message.constantinopleBlock = reader.string();
                    break;
                case 11:
                    message.petersburgBlock = reader.string();
                    break;
                case 12:
                    message.istanbulBlock = reader.string();
                    break;
                case 13:
                    message.muirGlacierBlock = reader.string();
                    break;
                case 14:
                    message.berlinBlock = reader.string();
                    break;
                case 18:
                    message.londonBlock = reader.string();
                    break;
                case 19:
                    message.arrowGlacierBlock = reader.string();
                    break;
                case 20:
                    message.mergeForkBlock = reader.string();
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
            homesteadBlock: isSet(object.homesteadBlock) ? String(object.homesteadBlock) : '',
            daoForkBlock: isSet(object.daoForkBlock) ? String(object.daoForkBlock) : '',
            daoForkSupport: isSet(object.daoForkSupport) ? Boolean(object.daoForkSupport) : false,
            eip150Block: isSet(object.eip150Block) ? String(object.eip150Block) : '',
            eip150Hash: isSet(object.eip150Hash) ? String(object.eip150Hash) : '',
            eip155Block: isSet(object.eip155Block) ? String(object.eip155Block) : '',
            eip158Block: isSet(object.eip158Block) ? String(object.eip158Block) : '',
            byzantiumBlock: isSet(object.byzantiumBlock) ? String(object.byzantiumBlock) : '',
            constantinopleBlock: isSet(object.constantinopleBlock) ? String(object.constantinopleBlock) : '',
            petersburgBlock: isSet(object.petersburgBlock) ? String(object.petersburgBlock) : '',
            istanbulBlock: isSet(object.istanbulBlock) ? String(object.istanbulBlock) : '',
            muirGlacierBlock: isSet(object.muirGlacierBlock) ? String(object.muirGlacierBlock) : '',
            berlinBlock: isSet(object.berlinBlock) ? String(object.berlinBlock) : '',
            londonBlock: isSet(object.londonBlock) ? String(object.londonBlock) : '',
            arrowGlacierBlock: isSet(object.arrowGlacierBlock) ? String(object.arrowGlacierBlock) : '',
            mergeForkBlock: isSet(object.mergeForkBlock) ? String(object.mergeForkBlock) : '',
        };
    },
    toJSON(message) {
        const obj = {};
        message.chainId !== undefined && (obj.chainId = message.chainId);
        message.homesteadBlock !== undefined && (obj.homesteadBlock = message.homesteadBlock);
        message.daoForkBlock !== undefined && (obj.daoForkBlock = message.daoForkBlock);
        message.daoForkSupport !== undefined && (obj.daoForkSupport = message.daoForkSupport);
        message.eip150Block !== undefined && (obj.eip150Block = message.eip150Block);
        message.eip150Hash !== undefined && (obj.eip150Hash = message.eip150Hash);
        message.eip155Block !== undefined && (obj.eip155Block = message.eip155Block);
        message.eip158Block !== undefined && (obj.eip158Block = message.eip158Block);
        message.byzantiumBlock !== undefined && (obj.byzantiumBlock = message.byzantiumBlock);
        message.constantinopleBlock !== undefined && (obj.constantinopleBlock = message.constantinopleBlock);
        message.petersburgBlock !== undefined && (obj.petersburgBlock = message.petersburgBlock);
        message.istanbulBlock !== undefined && (obj.istanbulBlock = message.istanbulBlock);
        message.muirGlacierBlock !== undefined && (obj.muirGlacierBlock = message.muirGlacierBlock);
        message.berlinBlock !== undefined && (obj.berlinBlock = message.berlinBlock);
        message.londonBlock !== undefined && (obj.londonBlock = message.londonBlock);
        message.arrowGlacierBlock !== undefined && (obj.arrowGlacierBlock = message.arrowGlacierBlock);
        message.mergeForkBlock !== undefined && (obj.mergeForkBlock = message.mergeForkBlock);
        return obj;
    },
    create(base) {
        return exports.ChainConfig.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        const message = createBaseChainConfig();
        message.chainId = (_a = object.chainId) !== null && _a !== void 0 ? _a : '';
        message.homesteadBlock = (_b = object.homesteadBlock) !== null && _b !== void 0 ? _b : '';
        message.daoForkBlock = (_c = object.daoForkBlock) !== null && _c !== void 0 ? _c : '';
        message.daoForkSupport = (_d = object.daoForkSupport) !== null && _d !== void 0 ? _d : false;
        message.eip150Block = (_e = object.eip150Block) !== null && _e !== void 0 ? _e : '';
        message.eip150Hash = (_f = object.eip150Hash) !== null && _f !== void 0 ? _f : '';
        message.eip155Block = (_g = object.eip155Block) !== null && _g !== void 0 ? _g : '';
        message.eip158Block = (_h = object.eip158Block) !== null && _h !== void 0 ? _h : '';
        message.byzantiumBlock = (_j = object.byzantiumBlock) !== null && _j !== void 0 ? _j : '';
        message.constantinopleBlock = (_k = object.constantinopleBlock) !== null && _k !== void 0 ? _k : '';
        message.petersburgBlock = (_l = object.petersburgBlock) !== null && _l !== void 0 ? _l : '';
        message.istanbulBlock = (_m = object.istanbulBlock) !== null && _m !== void 0 ? _m : '';
        message.muirGlacierBlock = (_o = object.muirGlacierBlock) !== null && _o !== void 0 ? _o : '';
        message.berlinBlock = (_p = object.berlinBlock) !== null && _p !== void 0 ? _p : '';
        message.londonBlock = (_q = object.londonBlock) !== null && _q !== void 0 ? _q : '';
        message.arrowGlacierBlock = (_r = object.arrowGlacierBlock) !== null && _r !== void 0 ? _r : '';
        message.mergeForkBlock = (_s = object.mergeForkBlock) !== null && _s !== void 0 ? _s : '';
        return message;
    },
};
function createBaseState() {
    return { key: '', value: '' };
}
exports.State = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key !== '') {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== '') {
            writer.uint32(18).string(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseState();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = reader.string();
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
            key: isSet(object.key) ? String(object.key) : '',
            value: isSet(object.value) ? String(object.value) : '',
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        return obj;
    },
    create(base) {
        return exports.State.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseState();
        message.key = (_a = object.key) !== null && _a !== void 0 ? _a : '';
        message.value = (_b = object.value) !== null && _b !== void 0 ? _b : '';
        return message;
    },
};
function createBaseTransactionLogs() {
    return { hash: '', logs: [] };
}
exports.TransactionLogs = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.hash !== '') {
            writer.uint32(10).string(message.hash);
        }
        for (const v of message.logs) {
            exports.Log.encode(v, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTransactionLogs();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.hash = reader.string();
                    break;
                case 2:
                    message.logs.push(exports.Log.decode(reader, reader.uint32()));
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
            logs: Array.isArray(object === null || object === void 0 ? void 0 : object.logs) ? object.logs.map((e) => exports.Log.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.hash !== undefined && (obj.hash = message.hash);
        if (message.logs) {
            obj.logs = message.logs.map(e => (e ? exports.Log.toJSON(e) : undefined));
        }
        else {
            obj.logs = [];
        }
        return obj;
    },
    create(base) {
        return exports.TransactionLogs.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseTransactionLogs();
        message.hash = (_a = object.hash) !== null && _a !== void 0 ? _a : '';
        message.logs = ((_b = object.logs) === null || _b === void 0 ? void 0 : _b.map(e => exports.Log.fromPartial(e))) || [];
        return message;
    },
};
function createBaseLog() {
    return {
        address: '',
        topics: [],
        data: new Uint8Array(),
        blockNumber: 0,
        txHash: '',
        txIndex: 0,
        blockHash: '',
        index: 0,
        removed: false,
    };
}
exports.Log = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== '') {
            writer.uint32(10).string(message.address);
        }
        for (const v of message.topics) {
            writer.uint32(18).string(v);
        }
        if (message.data.length !== 0) {
            writer.uint32(26).bytes(message.data);
        }
        if (message.blockNumber !== 0) {
            writer.uint32(32).uint64(message.blockNumber);
        }
        if (message.txHash !== '') {
            writer.uint32(42).string(message.txHash);
        }
        if (message.txIndex !== 0) {
            writer.uint32(48).uint64(message.txIndex);
        }
        if (message.blockHash !== '') {
            writer.uint32(58).string(message.blockHash);
        }
        if (message.index !== 0) {
            writer.uint32(64).uint64(message.index);
        }
        if (message.removed === true) {
            writer.uint32(72).bool(message.removed);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseLog();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.topics.push(reader.string());
                    break;
                case 3:
                    message.data = reader.bytes();
                    break;
                case 4:
                    message.blockNumber = longToNumber(reader.uint64());
                    break;
                case 5:
                    message.txHash = reader.string();
                    break;
                case 6:
                    message.txIndex = longToNumber(reader.uint64());
                    break;
                case 7:
                    message.blockHash = reader.string();
                    break;
                case 8:
                    message.index = longToNumber(reader.uint64());
                    break;
                case 9:
                    message.removed = reader.bool();
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
            address: isSet(object.address) ? String(object.address) : '',
            topics: Array.isArray(object === null || object === void 0 ? void 0 : object.topics) ? object.topics.map((e) => String(e)) : [],
            data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(),
            blockNumber: isSet(object.blockNumber) ? Number(object.blockNumber) : 0,
            txHash: isSet(object.txHash) ? String(object.txHash) : '',
            txIndex: isSet(object.txIndex) ? Number(object.txIndex) : 0,
            blockHash: isSet(object.blockHash) ? String(object.blockHash) : '',
            index: isSet(object.index) ? Number(object.index) : 0,
            removed: isSet(object.removed) ? Boolean(object.removed) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        if (message.topics) {
            obj.topics = message.topics.map(e => e);
        }
        else {
            obj.topics = [];
        }
        message.data !== undefined &&
            (obj.data = base64FromBytes(message.data !== undefined ? message.data : new Uint8Array()));
        message.blockNumber !== undefined && (obj.blockNumber = Math.round(message.blockNumber));
        message.txHash !== undefined && (obj.txHash = message.txHash);
        message.txIndex !== undefined && (obj.txIndex = Math.round(message.txIndex));
        message.blockHash !== undefined && (obj.blockHash = message.blockHash);
        message.index !== undefined && (obj.index = Math.round(message.index));
        message.removed !== undefined && (obj.removed = message.removed);
        return obj;
    },
    create(base) {
        return exports.Log.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const message = createBaseLog();
        message.address = (_a = object.address) !== null && _a !== void 0 ? _a : '';
        message.topics = ((_b = object.topics) === null || _b === void 0 ? void 0 : _b.map(e => e)) || [];
        message.data = (_c = object.data) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.blockNumber = (_d = object.blockNumber) !== null && _d !== void 0 ? _d : 0;
        message.txHash = (_e = object.txHash) !== null && _e !== void 0 ? _e : '';
        message.txIndex = (_f = object.txIndex) !== null && _f !== void 0 ? _f : 0;
        message.blockHash = (_g = object.blockHash) !== null && _g !== void 0 ? _g : '';
        message.index = (_h = object.index) !== null && _h !== void 0 ? _h : 0;
        message.removed = (_j = object.removed) !== null && _j !== void 0 ? _j : false;
        return message;
    },
};
function createBaseTxResult() {
    return {
        contractAddress: '',
        bloom: new Uint8Array(),
        txLogs: undefined,
        ret: new Uint8Array(),
        reverted: false,
        gasUsed: 0,
    };
}
exports.TxResult = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.contractAddress !== '') {
            writer.uint32(10).string(message.contractAddress);
        }
        if (message.bloom.length !== 0) {
            writer.uint32(18).bytes(message.bloom);
        }
        if (message.txLogs !== undefined) {
            exports.TransactionLogs.encode(message.txLogs, writer.uint32(26).fork()).ldelim();
        }
        if (message.ret.length !== 0) {
            writer.uint32(34).bytes(message.ret);
        }
        if (message.reverted === true) {
            writer.uint32(40).bool(message.reverted);
        }
        if (message.gasUsed !== 0) {
            writer.uint32(48).uint64(message.gasUsed);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTxResult();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.contractAddress = reader.string();
                    break;
                case 2:
                    message.bloom = reader.bytes();
                    break;
                case 3:
                    message.txLogs = exports.TransactionLogs.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.ret = reader.bytes();
                    break;
                case 5:
                    message.reverted = reader.bool();
                    break;
                case 6:
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
            contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : '',
            bloom: isSet(object.bloom) ? bytesFromBase64(object.bloom) : new Uint8Array(),
            txLogs: isSet(object.txLogs) ? exports.TransactionLogs.fromJSON(object.txLogs) : undefined,
            ret: isSet(object.ret) ? bytesFromBase64(object.ret) : new Uint8Array(),
            reverted: isSet(object.reverted) ? Boolean(object.reverted) : false,
            gasUsed: isSet(object.gasUsed) ? Number(object.gasUsed) : 0,
        };
    },
    toJSON(message) {
        const obj = {};
        message.contractAddress !== undefined && (obj.contractAddress = message.contractAddress);
        message.bloom !== undefined &&
            (obj.bloom = base64FromBytes(message.bloom !== undefined ? message.bloom : new Uint8Array()));
        message.txLogs !== undefined &&
            (obj.txLogs = message.txLogs ? exports.TransactionLogs.toJSON(message.txLogs) : undefined);
        message.ret !== undefined &&
            (obj.ret = base64FromBytes(message.ret !== undefined ? message.ret : new Uint8Array()));
        message.reverted !== undefined && (obj.reverted = message.reverted);
        message.gasUsed !== undefined && (obj.gasUsed = Math.round(message.gasUsed));
        return obj;
    },
    create(base) {
        return exports.TxResult.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseTxResult();
        message.contractAddress = (_a = object.contractAddress) !== null && _a !== void 0 ? _a : '';
        message.bloom = (_b = object.bloom) !== null && _b !== void 0 ? _b : new Uint8Array();
        message.txLogs =
            object.txLogs !== undefined && object.txLogs !== null
                ? exports.TransactionLogs.fromPartial(object.txLogs)
                : undefined;
        message.ret = (_c = object.ret) !== null && _c !== void 0 ? _c : new Uint8Array();
        message.reverted = (_d = object.reverted) !== null && _d !== void 0 ? _d : false;
        message.gasUsed = (_e = object.gasUsed) !== null && _e !== void 0 ? _e : 0;
        return message;
    },
};
function createBaseAccessTuple() {
    return { address: '', storageKeys: [] };
}
exports.AccessTuple = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.address !== '') {
            writer.uint32(10).string(message.address);
        }
        for (const v of message.storageKeys) {
            writer.uint32(18).string(v);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseAccessTuple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.address = reader.string();
                    break;
                case 2:
                    message.storageKeys.push(reader.string());
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
            address: isSet(object.address) ? String(object.address) : '',
            storageKeys: Array.isArray(object === null || object === void 0 ? void 0 : object.storageKeys) ? object.storageKeys.map((e) => String(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        message.address !== undefined && (obj.address = message.address);
        if (message.storageKeys) {
            obj.storageKeys = message.storageKeys.map(e => e);
        }
        else {
            obj.storageKeys = [];
        }
        return obj;
    },
    create(base) {
        return exports.AccessTuple.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseAccessTuple();
        message.address = (_a = object.address) !== null && _a !== void 0 ? _a : '';
        message.storageKeys = ((_b = object.storageKeys) === null || _b === void 0 ? void 0 : _b.map(e => e)) || [];
        return message;
    },
};
function createBaseTraceConfig() {
    return {
        tracer: '',
        timeout: '',
        reexec: 0,
        disableStack: false,
        disableStorage: false,
        debug: false,
        limit: 0,
        overrides: undefined,
        enableMemory: false,
        enableReturnData: false,
    };
}
exports.TraceConfig = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.tracer !== '') {
            writer.uint32(10).string(message.tracer);
        }
        if (message.timeout !== '') {
            writer.uint32(18).string(message.timeout);
        }
        if (message.reexec !== 0) {
            writer.uint32(24).uint64(message.reexec);
        }
        if (message.disableStack === true) {
            writer.uint32(40).bool(message.disableStack);
        }
        if (message.disableStorage === true) {
            writer.uint32(48).bool(message.disableStorage);
        }
        if (message.debug === true) {
            writer.uint32(64).bool(message.debug);
        }
        if (message.limit !== 0) {
            writer.uint32(72).int32(message.limit);
        }
        if (message.overrides !== undefined) {
            exports.ChainConfig.encode(message.overrides, writer.uint32(82).fork()).ldelim();
        }
        if (message.enableMemory === true) {
            writer.uint32(88).bool(message.enableMemory);
        }
        if (message.enableReturnData === true) {
            writer.uint32(96).bool(message.enableReturnData);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseTraceConfig();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.tracer = reader.string();
                    break;
                case 2:
                    message.timeout = reader.string();
                    break;
                case 3:
                    message.reexec = longToNumber(reader.uint64());
                    break;
                case 5:
                    message.disableStack = reader.bool();
                    break;
                case 6:
                    message.disableStorage = reader.bool();
                    break;
                case 8:
                    message.debug = reader.bool();
                    break;
                case 9:
                    message.limit = reader.int32();
                    break;
                case 10:
                    message.overrides = exports.ChainConfig.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.enableMemory = reader.bool();
                    break;
                case 12:
                    message.enableReturnData = reader.bool();
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
            tracer: isSet(object.tracer) ? String(object.tracer) : '',
            timeout: isSet(object.timeout) ? String(object.timeout) : '',
            reexec: isSet(object.reexec) ? Number(object.reexec) : 0,
            disableStack: isSet(object.disableStack) ? Boolean(object.disableStack) : false,
            disableStorage: isSet(object.disableStorage) ? Boolean(object.disableStorage) : false,
            debug: isSet(object.debug) ? Boolean(object.debug) : false,
            limit: isSet(object.limit) ? Number(object.limit) : 0,
            overrides: isSet(object.overrides) ? exports.ChainConfig.fromJSON(object.overrides) : undefined,
            enableMemory: isSet(object.enableMemory) ? Boolean(object.enableMemory) : false,
            enableReturnData: isSet(object.enableReturnData) ? Boolean(object.enableReturnData) : false,
        };
    },
    toJSON(message) {
        const obj = {};
        message.tracer !== undefined && (obj.tracer = message.tracer);
        message.timeout !== undefined && (obj.timeout = message.timeout);
        message.reexec !== undefined && (obj.reexec = Math.round(message.reexec));
        message.disableStack !== undefined && (obj.disableStack = message.disableStack);
        message.disableStorage !== undefined && (obj.disableStorage = message.disableStorage);
        message.debug !== undefined && (obj.debug = message.debug);
        message.limit !== undefined && (obj.limit = Math.round(message.limit));
        message.overrides !== undefined &&
            (obj.overrides = message.overrides ? exports.ChainConfig.toJSON(message.overrides) : undefined);
        message.enableMemory !== undefined && (obj.enableMemory = message.enableMemory);
        message.enableReturnData !== undefined && (obj.enableReturnData = message.enableReturnData);
        return obj;
    },
    create(base) {
        return exports.TraceConfig.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const message = createBaseTraceConfig();
        message.tracer = (_a = object.tracer) !== null && _a !== void 0 ? _a : '';
        message.timeout = (_b = object.timeout) !== null && _b !== void 0 ? _b : '';
        message.reexec = (_c = object.reexec) !== null && _c !== void 0 ? _c : 0;
        message.disableStack = (_d = object.disableStack) !== null && _d !== void 0 ? _d : false;
        message.disableStorage = (_e = object.disableStorage) !== null && _e !== void 0 ? _e : false;
        message.debug = (_f = object.debug) !== null && _f !== void 0 ? _f : false;
        message.limit = (_g = object.limit) !== null && _g !== void 0 ? _g : 0;
        message.overrides =
            object.overrides !== undefined && object.overrides !== null
                ? exports.ChainConfig.fromPartial(object.overrides)
                : undefined;
        message.enableMemory = (_h = object.enableMemory) !== null && _h !== void 0 ? _h : false;
        message.enableReturnData = (_j = object.enableReturnData) !== null && _j !== void 0 ? _j : false;
        return message;
    },
};
function createBaseFeeMarketParams() {
    return {
        noBaseFee: false,
        baseFeeChangeDenominator: 0,
        elasticityMultiplier: 0,
        enableHeight: 0,
        baseFee: '',
    };
}
exports.FeeMarketParams = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.noBaseFee === true) {
            writer.uint32(8).bool(message.noBaseFee);
        }
        if (message.baseFeeChangeDenominator !== 0) {
            writer.uint32(16).uint32(message.baseFeeChangeDenominator);
        }
        if (message.elasticityMultiplier !== 0) {
            writer.uint32(24).uint32(message.elasticityMultiplier);
        }
        if (message.enableHeight !== 0) {
            writer.uint32(40).int64(message.enableHeight);
        }
        if (message.baseFee !== '') {
            writer.uint32(50).string(message.baseFee);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFeeMarketParams();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.noBaseFee = reader.bool();
                    break;
                case 2:
                    message.baseFeeChangeDenominator = reader.uint32();
                    break;
                case 3:
                    message.elasticityMultiplier = reader.uint32();
                    break;
                case 5:
                    message.enableHeight = longToNumber(reader.int64());
                    break;
                case 6:
                    message.baseFee = reader.string();
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
            noBaseFee: isSet(object.noBaseFee) ? Boolean(object.noBaseFee) : false,
            baseFeeChangeDenominator: isSet(object.baseFeeChangeDenominator)
                ? Number(object.baseFeeChangeDenominator)
                : 0,
            elasticityMultiplier: isSet(object.elasticityMultiplier) ? Number(object.elasticityMultiplier) : 0,
            enableHeight: isSet(object.enableHeight) ? Number(object.enableHeight) : 0,
            baseFee: isSet(object.baseFee) ? String(object.baseFee) : '',
        };
    },
    toJSON(message) {
        const obj = {};
        message.noBaseFee !== undefined && (obj.noBaseFee = message.noBaseFee);
        message.baseFeeChangeDenominator !== undefined &&
            (obj.baseFeeChangeDenominator = Math.round(message.baseFeeChangeDenominator));
        message.elasticityMultiplier !== undefined &&
            (obj.elasticityMultiplier = Math.round(message.elasticityMultiplier));
        message.enableHeight !== undefined && (obj.enableHeight = Math.round(message.enableHeight));
        message.baseFee !== undefined && (obj.baseFee = message.baseFee);
        return obj;
    },
    create(base) {
        return exports.FeeMarketParams.fromPartial(base !== null && base !== void 0 ? base : {});
    },
    fromPartial(object) {
        var _a, _b, _c, _d, _e;
        const message = createBaseFeeMarketParams();
        message.noBaseFee = (_a = object.noBaseFee) !== null && _a !== void 0 ? _a : false;
        message.baseFeeChangeDenominator = (_b = object.baseFeeChangeDenominator) !== null && _b !== void 0 ? _b : 0;
        message.elasticityMultiplier = (_c = object.elasticityMultiplier) !== null && _c !== void 0 ? _c : 0;
        message.enableHeight = (_d = object.enableHeight) !== null && _d !== void 0 ? _d : 0;
        message.baseFee = (_e = object.baseFee) !== null && _e !== void 0 ? _e : '';
        return message;
    },
};
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
//# sourceMappingURL=evm.js.map