"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserUploadedFileList = exports.writeFile = exports.writeFileToPath = exports.getUploadFileStream = exports.getEncodedFileChunks = exports.decodeFileChunks = exports.encodeFileChunks = exports.combineDecodedChunks = exports.encodeFileFromPath = exports.encodeFile = exports.encodeBuffer = exports.getFileChunk = exports.getFileChunks = exports.getFileInfo = exports.calculateFileHash = exports.getFileBuffer = void 0;
const cids_1 = __importDefault(require("cids"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const multihashing_async_1 = __importDefault(require("multihashing-async"));
const Sdk_1 = __importDefault(require("../../Sdk"));
const helpers_1 = require("../helpers");
const network_1 = require("../network");
// import * as Types from './types';
// async function wait(fn: any, ms: number) {
//   while (!fn()) {
//     await delay(ms);
//   }
// }
//
// function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }
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
const calculateFileHash = async (filePath) => {
    const fileBuffer = await (0, exports.getFileBuffer)(filePath);
    const md5Digest = crypto_1.default.createHash('md5').update(fileBuffer).digest();
    const encodedHash = await (0, multihashing_async_1.default)(md5Digest, 'keccak-256', 20);
    const cid = new cids_1.default(1, 'raw', encodedHash, 'base32hex');
    const realFileHash = cid.toString();
    return realFileHash;
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
        // console.log('🚀 ~ file: filesystem.ts ~ line 46 ~ getFileChunks ~ stats', stats);
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
            // if (chunk) {
            // console.log('chunk a read size', chunk.length);
            // }
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
    // await delay(2000);
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
// export const getEncodedFileChunk = async (
//   fileStream: fs.ReadStream,
//   offsetStart: number,
//   offsetEnd: number,
// ): Promise<string> => {
//   const fileChunk = await getFileChunk(fileStream, offsetStart, offsetEnd);
//
//   const encodedChunk = await encodeBuffer(fileChunk);
//   return encodedChunk;
// };
const getUploadFileStream = async (filePath) => {
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
exports.getUploadFileStream = getUploadFileStream;
const writeFileToPath = async (filePath, econdedFileContent) => {
    const decodedFileBuffer = Buffer.from(econdedFileContent, 'base64');
    return (0, exports.writeFile)(filePath, decodedFileBuffer);
};
exports.writeFileToPath = writeFileToPath;
const writeFile = (filePath, fileBuffer) => {
    try {
        fs_1.default.writeFileSync(filePath, fileBuffer);
    }
    catch (err) {
        console.log(`Could not write file to ${filePath}: Details: ${err.message}`);
    }
};
exports.writeFile = writeFile;
const getUserUploadedFileList = async (address, page = 0) => {
    const extraParams = [
        {
            walletaddr: address,
            page,
        },
    ];
    const connectedUrl = `${Sdk_1.default.environment.ppNodeUrl}:${Sdk_1.default.environment.ppNodePort}`;
    const message = `connecting to ${connectedUrl}`;
    console.log(message);
    const callResult = await (0, network_1.sendUserRequestList)(extraParams);
    const { response } = callResult;
    // console.log('file list request result', JSON.stringify(callResult));
    if (!response) {
        throw 'Could not fetch a list of files. No response in the call result';
    }
    const userFiles = response.result.fileinfo;
    return {
        originalResponse: response,
        files: userFiles,
    };
};
exports.getUserUploadedFileList = getUserUploadedFileList;
//# sourceMappingURL=filesystem.js.map