"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
var bignumber_js_1 = __importDefault(require("bignumber.js"));
var msw_1 = require("msw");
var node_1 = require("msw/node");
var config_1 = require("../../config");
var Sdk_1 = __importDefault(require("../../Sdk"));
var network = __importStar(require("./network"));
var myDefaultResult = [
    {
        foo: 'bar',
    },
    {
        barfoo: 'foobar',
    },
];
var defaultUrl = "https://foo.com";
var hostUrl = 'https://foo.bar';
var sdkEnvTest = {
    restUrl: defaultUrl,
    rpcUrl: defaultUrl,
    chainId: 'test-chain-1',
    explorerUrl: defaultUrl,
};
var server = (0, node_1.setupServer)(msw_1.rest.get(defaultUrl, function (_req, res, ctx) {
    return res(ctx.json(myDefaultResult));
}));
beforeAll(function () { return server.listen(); });
afterEach(function () { return server.resetHandlers(); });
afterAll(function () { return server.close(); });
describe('network (unit test)', function () {
    var testConfig = {
        headers: {
            testHeader: 'test-value',
        },
    };
    Sdk_1.default.init(__assign({}, sdkEnvTest));
    describe('apiPost', function () {
        var data = { foo: 'bar' };
        var myHandle = 'foobar';
        it('returns properly formatted response data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.post(defaultUrl, function (_req, res, ctx) {
                            return res(ctx.json(myHandle));
                        }));
                        return [4 /*yield*/, network.apiPost(defaultUrl, data, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response).toEqual('foobar');
                        return [2 /*return*/];
                }
            });
        }); });
        it('makes a call with no data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.post(defaultUrl, function (_req, res, ctx) {
                            return res(ctx.json(myHandle));
                        }));
                        return [4 /*yield*/, network.apiPost(defaultUrl, undefined, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        response = dataResult.response;
                        expect(response).toEqual('foobar');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.post(defaultUrl, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.apiPost(defaultUrl, data, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('apiGet', function () {
        it('returns properly formatted response data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, network.apiGet(defaultUrl, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        response = dataResult.response;
                        expect(response.length).toEqual(2);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        server.use(msw_1.rest.get(defaultUrl, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.apiGet(defaultUrl, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getSubmitTransactionData', function () {
        it('return empty tx data with no data given to the input', function () {
            var txData = network.getSubmitTransactionData();
            expect(txData).toStrictEqual({ response: undefined });
        });
        it('return empty tx data with empty string given to the input', function () {
            var givenData = '';
            var txData = network.getSubmitTransactionData(givenData);
            expect(txData).toStrictEqual({ response: undefined });
        });
        it('return given string parsed as number', function () {
            var givenData = '1234';
            var txData = network.getSubmitTransactionData(givenData);
            expect(txData).toStrictEqual({ response: 1234 });
        });
        it('return given stringified object properly parsed', function () {
            var givenData = {
                foo: 'bar',
                barfoo: 123,
            };
            var txData = network.getSubmitTransactionData(JSON.stringify(givenData));
            expect(txData).toEqual({ response: givenData });
        });
        it('return properly formatted error', function () {
            var givenData = '124343hh s';
            var txData = network.getSubmitTransactionData(givenData);
            expect(txData).not.toHaveProperty('response');
            expect(txData).toHaveProperty('error');
            expect(txData.error.message).toContain("Can't submit transaction. Can't parse transaction data.");
        });
        it('return properly formatted error for mailformed json', function () {
            var givenData = '{f:1}';
            var txData = network.getSubmitTransactionData(givenData);
            expect(txData).not.toHaveProperty('response');
            expect(txData).toHaveProperty('error');
            expect(txData.error.message).toContain("Can't submit transaction. Can't parse transaction data.");
        });
        it('return given stringified object properly parsed', function () {
            var givenData = {
                foo: 'bar',
                barfoo: 123434343434343435343434343434242342342432,
            };
            var txData = network.getSubmitTransactionData(JSON.stringify(givenData));
            var barfoo = txData.response.barfoo;
            expect(barfoo instanceof bignumber_js_1.default).toEqual(true);
        });
    });
    describe('submitTransaction', function () {
        var delegatorAddr = '123';
        var url = "".concat(hostUrl, "/staking/delegators/").concat(delegatorAddr, "/delegations");
        it('returns properly formatted response', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, myData, spy, spyPost, myNewData, dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';
                        myData = { foo: myResponse };
                        server.use(msw_1.rest.post(url, function (_req, res, ctx) {
                            var foo = _req.body.foo;
                            return res(ctx.json(foo));
                        }));
                        spy = jest.spyOn(network, 'getSubmitTransactionData');
                        spyPost = jest.spyOn(network, 'apiPost');
                        myNewData = JSON.stringify(myData);
                        return [4 /*yield*/, network.submitTransaction(delegatorAddr, myNewData, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        expect(dataResult.response).toBe(myResponse);
                        expect(spy).toHaveBeenCalledWith(myNewData);
                        expect(spy).toReturnWith({ response: myData });
                        expect(spyPost).toHaveBeenCalledWith(url, myData, testConfig);
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns properly formatted response with no input data', function () { return __awaiter(void 0, void 0, void 0, function () {
            var myResponse, dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        myResponse = 'f6efc414f09f30a0e69cad8da9ac87b97860d2e5019c8e9964cbc208ff856e3b';
                        server.use(msw_1.rest.post(url, function (_req, res, ctx) {
                            return res(ctx.json(myResponse));
                        }));
                        return [4 /*yield*/, network.submitTransaction(delegatorAddr, undefined, testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).toHaveProperty('response');
                        expect(dataResult).not.toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a server error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        server.use(msw_1.rest.post(url, function (_req, res, ctx) {
                            return res(ctx.status(500));
                        }));
                        return [4 /*yield*/, network.submitTransaction(delegatorAddr, '', testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns an error in case of a user error', function () { return __awaiter(void 0, void 0, void 0, function () {
            var dataResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        server.use(msw_1.rest.post(url, function (_req, res, ctx) {
                            return res(ctx.status(404));
                        }));
                        return [4 /*yield*/, network.submitTransaction(delegatorAddr, '', testConfig)];
                    case 1:
                        dataResult = _a.sent();
                        expect(dataResult).not.toHaveProperty('response');
                        expect(dataResult).toHaveProperty('error');
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAccountsData', function () {
        var address = '123';
        var url = "".concat(hostUrl, "/auth/acconts/").concat(address);
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getAccountsData(address)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getStakingValidators', function () {
        var address = '123';
        var url = "".concat(hostUrl, "/auth/acconts/").concat(address);
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getStakingValidators(address)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getTxListBlockchain', function () {
        var address = '123';
        var txType = 'from';
        var page = 1;
        var url = "".concat(hostUrl, "/txs");
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var params, spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        params = {
                            page: page,
                            limit: 3,
                            'message.sender': address,
                        };
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getTxListBlockchain(address, '')];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, { params: params });
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('calls api with a proper url having a given type', function () { return __awaiter(void 0, void 0, void 0, function () {
            var params, spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        params = {
                            page: page,
                            limit: 3,
                            'message.sender': address,
                            'message.action': txType,
                        };
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getTxListBlockchain(address, txType)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, { params: params });
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getValidatorsList', function () {
        var status = 'foo';
        var page = 1;
        var url = "".concat(hostUrl, "/staking/validators");
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getValidatorsList(status, page)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, { params: { page: page, status: status } });
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getValidatorsBondedToDelegatorList', function () {
        var delegatorAddress = '123';
        var status = 'foo';
        var url = "".concat(hostUrl, "/staking/delegators/").concat(delegatorAddress, "/validators");
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getValidatorsBondedToDelegatorList(status, delegatorAddress)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, { params: { status: status } });
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getValidator', function () {
        var address = '123';
        var url = "".concat(hostUrl, "/staking/validators/").concat(address);
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getValidator(address)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getStakingPool', function () {
        var url = "".concat(hostUrl, "/staking/pool");
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getStakingPool(undefined)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getAvailableBalance', function () {
        var address = '123';
        var url = "".concat(hostUrl, "/bank/balances/").concat(address);
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getAvailableBalance(address)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getDelegatedBalance', function () {
        var delegatorAddr = '123';
        var url = "".concat(hostUrl, "/staking/delegators/").concat(delegatorAddr, "/delegations");
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getDelegatedBalance(delegatorAddr)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getUnboundingBalance', function () {
        var delegatorAddr = '123';
        var url = "".concat(hostUrl, "/staking/delegators/").concat(delegatorAddr, "/unbonding_delegations");
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getUnboundingBalance(delegatorAddr)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getRewardBalance', function () {
        var delegatorAddr = '123';
        var url = "".concat(hostUrl, "/distribution/delegators/").concat(delegatorAddr, "/rewards");
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getRewardBalance(delegatorAddr)];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('requestBalanceIncrease', function () {
        var walletAddress = '123';
        var faucetUrl = "".concat(hostUrl, "/345");
        var url = "".concat(faucetUrl, "/").concat(walletAddress);
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiPost;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { restUrl: hostUrl }));
                        spyApiPost = jest.spyOn(network, 'apiPost');
                        server.use(msw_1.rest.post(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.requestBalanceIncrease(walletAddress, faucetUrl, config_1.hdVault.stratosTopDenom, testConfig)];
                    case 1:
                        _a.sent();
                        expect(spyApiPost).toHaveBeenCalledWith(url, {}, testConfig);
                        spyApiPost.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getRpcStatus', function () {
        var url = "".concat(hostUrl, "/status");
        it('calls api with a proper url', function () { return __awaiter(void 0, void 0, void 0, function () {
            var spyApiGet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { rpcUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'apiGet');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json({}));
                        }));
                        return [4 /*yield*/, network.getRpcStatus()];
                    case 1:
                        _a.sent();
                        expect(spyApiGet).toHaveBeenCalledWith(url, undefined);
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('getChainId', function () {
        var url = "".concat(hostUrl, "/status");
        it('returns proper chainId', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, spyApiGet, chainId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            result: {
                                node_info: {
                                    network: 'foobar',
                                },
                            },
                        };
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { rpcUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'getRpcStatus');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(response));
                        }));
                        return [4 /*yield*/, network.getChainId()];
                    case 1:
                        chainId = _a.sent();
                        expect(chainId).toEqual('foobar');
                        expect(spyApiGet).toHaveBeenCalledWith();
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('returns undefined in case of error in getRpcStatus', function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, spyApiGet, chainId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = {
                            result: {
                                bnar: 'foo',
                            },
                        };
                        Sdk_1.default.init(__assign(__assign({}, sdkEnvTest), { rpcUrl: hostUrl }));
                        spyApiGet = jest.spyOn(network, 'getRpcStatus');
                        server.use(msw_1.rest.get(url, function (_req, res, ctx) {
                            return res(ctx.json(response));
                        }));
                        return [4 /*yield*/, network.getChainId()];
                    case 1:
                        chainId = _a.sent();
                        expect(chainId).toEqual(undefined);
                        expect(spyApiGet).toHaveBeenCalledWith();
                        spyApiGet.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=network.spec.js.map