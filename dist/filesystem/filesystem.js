"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileToPath = exports.writeFile = exports.getLocalFileReadStream = exports.getEncodedFileChunks = exports.decodeFileChunks = exports.encodeFileChunks = exports.combineDecodedChunks = exports.encodeFileFromPath = exports.encodeFile = exports.encodeBuffer = exports.getFileChunk = exports.getFileChunks = exports.getFileInfo = exports.calculateFileHash = exports.calculateFileHashFromBuffer = exports.calculateFileHashOld = exports.getFileBuffer = void 0;
const cids_1 = __importDefault(require("cids"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const base32_1 = require("multiformats/bases/base32");
const cid_1 = require("multiformats/cid");
const hasher = __importStar(require("multiformats/hashes/hasher"));
const multihashing_async_1 = __importDefault(require("multihashing-async"));
const helpers_1 = require("../services/helpers");
const getFileBuffer = async (filePath) => {
    try {
        const fileBuffer = fs_1.default.readFileSync(filePath);
        return fileBuffer;
    }
    catch (err) {
        throw new Error(`Could not read a file from ${filePath}: Details: ${err.message}`);
    }
};
exports.getFileBuffer = getFileBuffer;
const calculateFileHashOld = async (filePath) => {
    const fileBuffer = await (0, exports.getFileBuffer)(filePath);
    const md5Digest = crypto_1.default.createHash('md5').update(fileBuffer).digest();
    const encodedHash = await (0, multihashing_async_1.default)(md5Digest, 'keccak-256', 20);
    const cid = new cids_1.default(1, 'raw', encodedHash, 'base32hex');
    const realFileHash = cid.toString();
    return realFileHash;
};
exports.calculateFileHashOld = calculateFileHashOld;
const calculateFileHashFromBuffer = async (fileBuffer) => {
    const firstKeccak = await (0, multihashing_async_1.default)(fileBuffer, 'keccak-256', 20);
    const secondKeccak = await (0, multihashing_async_1.default)(firstKeccak, 'keccak-256', 20);
    const keccak256Hasher = hasher.from({
        name: 'keccak-256',
        code: 0x1b,
        encode: input => input.slice(-20),
    });
    const encodedHashO = await keccak256Hasher.digest(secondKeccak);
    const cid = cid_1.CID.create(1, 0x66, encodedHashO);
    const realFileHash = cid.toString(base32_1.base32hex);
    return realFileHash;
};
exports.calculateFileHashFromBuffer = calculateFileHashFromBuffer;
const calculateFileHash = async (filePath) => {
    const fileBuffer = await (0, exports.getFileBuffer)(filePath);
    return (0, exports.calculateFileHashFromBuffer)(fileBuffer);
};
exports.calculateFileHash = calculateFileHash;
const getFileInfo = async (filePath) => {
    let openedFileInfo = { size: 0, filehash: '' };
    try {
        const fileStream = fs_1.default.createReadStream(filePath);
        const stats = fs_1.default.statSync(filePath);
        const _filehash = await (0, exports.calculateFileHash)(filePath);
        openedFileInfo = await new Promise((resolve, reject) => {
            const result = {
                size: 0,
                filehash: _filehash,
            };
            fileStream.on('readable', function () {
                result.size = stats.size;
                resolve(result);
            });
            fileStream.on('error', function (error) {
                reject(error);
            });
        });
    }
    catch (error) {
        console.log(error);
    }
    return openedFileInfo;
};
exports.getFileInfo = getFileInfo;
const getFileChunks = async (filePath, chunkSize = 10000) => {
    let chunksList = [];
    try {
        const fileStream = fs_1.default.createReadStream(filePath);
        const stats = fs_1.default.statSync(filePath);
        chunksList = await new Promise((resolve, reject) => {
            let bytesRead = 0;
            const result = [];
            fileStream.on('readable', function () {
                /* eslint-disable-next-line no-constant-condition */
                while (true) {
                    // no-constant-condition
                    const chunk = fileStream.read(chunkSize);
                    console.log('ch size', chunkSize);
                    if (!chunk || !chunk.length) {
                        break;
                    }
                    console.log('chunked chunk length', chunk.length);
                    bytesRead += chunk.length;
                    result.push(chunk);
                }
                if (bytesRead >= stats.size) {
                    resolve(result);
                }
            });
            fileStream.on('error', function (error) {
                reject(error);
            });
        });
    }
    catch (error) {
        console.log(error);
    }
    return chunksList;
};
exports.getFileChunks = getFileChunks;
const getFileChunk = async (fileStream, readChunkSize) => {
    let chunksList;
    try {
        chunksList = await new Promise(resolve => {
            const chunk = fileStream.read(readChunkSize);
            resolve(chunk);
        });
    }
    catch (error) {
        console.log(error);
        throw 'could not read file chunk';
    }
    return chunksList;
};
exports.getFileChunk = getFileChunk;
async function encodeBuffer(chunk) {
    await (0, helpers_1.delay)(100);
    // NOTE: Cannot create a string longer than 0x1fffffe8 characters
    const base64data = chunk.toString('base64');
    return base64data;
}
exports.encodeBuffer = encodeBuffer;
const encodeFile = async (fileBuffer) => {
    const encodedFile = await encodeBuffer(fileBuffer);
    return encodedFile;
};
exports.encodeFile = encodeFile;
const encodeFileFromPath = async (filePath) => {
    const fileChunksList = await (0, exports.getFileChunks)(filePath);
    const fileBuffer = (0, exports.combineDecodedChunks)(fileChunksList);
    const encodedFile = await (0, exports.encodeFile)(fileBuffer);
    return encodedFile;
};
exports.encodeFileFromPath = encodeFileFromPath;
const combineDecodedChunks = (fileChunksList) => {
    const fileBuffer = Buffer.concat(fileChunksList);
    return fileBuffer;
};
exports.combineDecodedChunks = combineDecodedChunks;
const encodeFileChunks = async (chunksList) => {
    const chunksOfBase64Promises = chunksList.map(async (chunk) => {
        const encodedChunk = await encodeBuffer(chunk);
        return encodedChunk;
    });
    const encodedChunksList = await Promise.all(chunksOfBase64Promises);
    return encodedChunksList;
};
exports.encodeFileChunks = encodeFileChunks;
const decodeFileChunks = async (encodedChunksList) => {
    const decodedChunksList = encodedChunksList.map(base64dataChunk => Buffer.from(base64dataChunk, 'base64'));
    return decodedChunksList;
};
exports.decodeFileChunks = decodeFileChunks;
const getEncodedFileChunks = async (filePath, chunkSize = 10000) => {
    const fileChunksList = await (0, exports.getFileChunks)(filePath, chunkSize);
    const encodedFileChunksList = await (0, exports.encodeFileChunks)(fileChunksList);
    return encodedFileChunksList;
};
exports.getEncodedFileChunks = getEncodedFileChunks;
const getLocalFileReadStream = async (filePath) => {
    try {
        const fileStream = fs_1.default.createReadStream(filePath);
        const myStream = await new Promise((resolve, reject) => {
            fileStream.on('readable', function () {
                resolve(fileStream);
            });
            fileStream.on('error', function (error) {
                reject(error);
            });
        });
        return myStream;
    }
    catch (error) {
        const errorMessage = `could not create file stream at path ${filePath}`;
        console.log(errorMessage, error);
        throw new Error(errorMessage);
    }
};
exports.getLocalFileReadStream = getLocalFileReadStream;
const writeFile = (filePath, fileBuffer) => {
    try {
        fs_1.default.writeFileSync(filePath, fileBuffer);
    }
    catch (err) {
        console.log(`Could not write file to ${filePath}: Details: ${err.message}`);
    }
};
exports.writeFile = writeFile;
const writeFileToPath = async (filePath, econdedFileContent) => {
    const decodedFileBuffer = Buffer.from(econdedFileContent, 'base64');
    return (0, exports.writeFile)(filePath, decodedFileBuffer);
};
exports.writeFileToPath = writeFileToPath;
//# sourceMappingURL=filesystem.js.map