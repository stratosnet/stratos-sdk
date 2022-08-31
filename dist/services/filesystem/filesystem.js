"use strict";
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
        while (_) try {
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
exports.writeFile = exports.writeFileToPath = exports.getEncodedFileChunks = exports.decodeFileChunks = exports.encodeFileChunks = exports.combineDecodedChunks = exports.encodeFileFromPath = exports.encodeFile = exports.encodeBuffer = exports.getFileChunks = exports.getFileInfo = exports.calculateFileHash = exports.getFileBuffer = void 0;
var cids_1 = __importDefault(require("cids"));
var crypto_1 = __importDefault(require("crypto"));
var fs_1 = __importDefault(require("fs"));
var multihashing_async_1 = __importDefault(require("multihashing-async"));
// import * as Types from './types';
function wait(fn, ms) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!fn()) return [3 /*break*/, 2];
                    return [4 /*yield*/, delay(ms)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    });
}
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
var getFileBuffer = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var fileBuffer;
    return __generator(this, function (_a) {
        try {
            fileBuffer = fs_1.default.readFileSync(filePath);
            return [2 /*return*/, fileBuffer];
        }
        catch (err) {
            throw new Error("Could not read a file from " + filePath + ": Details: " + err.message);
        }
        return [2 /*return*/];
    });
}); };
exports.getFileBuffer = getFileBuffer;
var calculateFileHash = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var fileBuffer, md5Digest, encodedHash, cid, realFileHash;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getFileBuffer)(filePath)];
            case 1:
                fileBuffer = _a.sent();
                md5Digest = crypto_1.default.createHash('md5').update(fileBuffer).digest();
                return [4 /*yield*/, (0, multihashing_async_1.default)(md5Digest, 'keccak-256', 20)];
            case 2:
                encodedHash = _a.sent();
                cid = new cids_1.default(1, 'raw', encodedHash, 'base32hex');
                realFileHash = cid.toString();
                return [2 /*return*/, realFileHash];
        }
    });
}); };
exports.calculateFileHash = calculateFileHash;
var processFileChunk = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); };
var getFileInfo = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var openedFileInfo, fileStream_1, stats_1, _filehash_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                openedFileInfo = { size: 0, filehash: '' };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                fileStream_1 = fs_1.default.createReadStream(filePath);
                stats_1 = fs_1.default.statSync(filePath);
                return [4 /*yield*/, (0, exports.calculateFileHash)(filePath)];
            case 2:
                _filehash_1 = _a.sent();
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var result = {
                            size: 0,
                            filehash: _filehash_1,
                        };
                        fileStream_1.on('readable', function () {
                            result.size = stats_1.size;
                            resolve(result);
                        });
                        fileStream_1.on('error', function (error) {
                            reject(error);
                        });
                    })];
            case 3:
                openedFileInfo = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, openedFileInfo];
        }
    });
}); };
exports.getFileInfo = getFileInfo;
var getFileChunks = function (filePath, chunkSize) {
    if (chunkSize === void 0) { chunkSize = 10000; }
    return __awaiter(void 0, void 0, void 0, function () {
        var chunksList, fileStream_2, stats_2, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chunksList = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    fileStream_2 = fs_1.default.createReadStream(filePath);
                    stats_2 = fs_1.default.statSync(filePath);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var bytesRead = 0;
                            var result = [];
                            fileStream_2.on('readable', function () {
                                /* eslint-disable-next-line no-constant-condition */
                                while (true) {
                                    // no-constant-condition
                                    var chunk = fileStream_2.read(chunkSize);
                                    if (!chunk || !chunk.length) {
                                        break;
                                    }
                                    bytesRead += chunk.length;
                                    result.push(chunk);
                                }
                                if (bytesRead >= stats_2.size) {
                                    resolve(result);
                                }
                            });
                            fileStream_2.on('error', function (error) {
                                reject(error);
                            });
                        })];
                case 2:
                    // console.log('🚀 ~ file: filesystem.ts ~ line 46 ~ getFileChunks ~ stats', stats);
                    chunksList = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, chunksList];
            }
        });
    });
};
exports.getFileChunks = getFileChunks;
function encodeBuffer(chunk) {
    return __awaiter(this, void 0, void 0, function () {
        var base64data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, delay(2000)];
                case 1:
                    _a.sent();
                    base64data = chunk.toString('base64');
                    return [2 /*return*/, base64data];
            }
        });
    });
}
exports.encodeBuffer = encodeBuffer;
var encodeFile = function (fileBuffer) { return __awaiter(void 0, void 0, void 0, function () {
    var encodedFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, encodeBuffer(fileBuffer)];
            case 1:
                encodedFile = _a.sent();
                return [2 /*return*/, encodedFile];
        }
    });
}); };
exports.encodeFile = encodeFile;
var encodeFileFromPath = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var fileChunksList, fileBuffer, encodedFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getFileChunks)(filePath)];
            case 1:
                fileChunksList = _a.sent();
                fileBuffer = (0, exports.combineDecodedChunks)(fileChunksList);
                return [4 /*yield*/, (0, exports.encodeFile)(fileBuffer)];
            case 2:
                encodedFile = _a.sent();
                return [2 /*return*/, encodedFile];
        }
    });
}); };
exports.encodeFileFromPath = encodeFileFromPath;
var combineDecodedChunks = function (fileChunksList) {
    var fileBuffer = Buffer.concat(fileChunksList);
    return fileBuffer;
};
exports.combineDecodedChunks = combineDecodedChunks;
var encodeFileChunks = function (chunksList) { return __awaiter(void 0, void 0, void 0, function () {
    var chunksOfBase64Promises, encodedChunksList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chunksOfBase64Promises = chunksList.map(function (chunk) { return __awaiter(void 0, void 0, void 0, function () {
                    var encodedChunk;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, encodeBuffer(chunk)];
                            case 1:
                                encodedChunk = _a.sent();
                                return [2 /*return*/, encodedChunk];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(chunksOfBase64Promises)];
            case 1:
                encodedChunksList = _a.sent();
                return [2 /*return*/, encodedChunksList];
        }
    });
}); };
exports.encodeFileChunks = encodeFileChunks;
var decodeFileChunks = function (encodedChunksList) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedChunksList;
    return __generator(this, function (_a) {
        decodedChunksList = encodedChunksList.map(function (base64dataChunk) { return Buffer.from(base64dataChunk, 'base64'); });
        return [2 /*return*/, decodedChunksList];
    });
}); };
exports.decodeFileChunks = decodeFileChunks;
var getEncodedFileChunks = function (filePath, chunksSize) {
    if (chunksSize === void 0) { chunksSize = 10000; }
    return __awaiter(void 0, void 0, void 0, function () {
        var fileChunksList, encodedFileChunksList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exports.getFileChunks)(filePath, chunksSize)];
                case 1:
                    fileChunksList = _a.sent();
                    return [4 /*yield*/, (0, exports.encodeFileChunks)(fileChunksList)];
                case 2:
                    encodedFileChunksList = _a.sent();
                    return [2 /*return*/, encodedFileChunksList];
            }
        });
    });
};
exports.getEncodedFileChunks = getEncodedFileChunks;
var writeFileToPath = function (filePath, econdedFileContent) { return __awaiter(void 0, void 0, void 0, function () {
    var decodedFileBuffer;
    return __generator(this, function (_a) {
        decodedFileBuffer = Buffer.from(econdedFileContent, 'base64');
        return [2 /*return*/, (0, exports.writeFile)(filePath, decodedFileBuffer)];
    });
}); };
exports.writeFileToPath = writeFileToPath;
var writeFile = function (filePath, fileBuffer) {
    try {
        fs_1.default.writeFileSync(filePath, fileBuffer);
    }
    catch (err) {
        console.log("Could not write file to " + filePath + ": Details: " + err.message);
    }
};
exports.writeFile = writeFile;
//# sourceMappingURL=filesystem.js.map