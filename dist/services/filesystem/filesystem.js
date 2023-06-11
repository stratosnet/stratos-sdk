"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFileToPath = exports.writeFile = exports.getEncodedFileChunks = exports.decodeFileChunks = exports.encodeFileChunks = exports.combineDecodedChunks = exports.encodeFileFromPath = exports.encodeFile = exports.encodeBuffer = exports.getFileChunk = exports.getFileChunks = exports.getFileInfo = exports.calculateFileHash = exports.getFileBuffer = void 0;
const cids_1 = __importDefault(require("cids"));
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const multihashing_async_1 = __importDefault(require("multihashing-async"));
const helpers_1 = require("../helpers");
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
// export const getUploadFileStream = async (filePath: string): Promise<fs.ReadStream> => {
//   try {
//     const fileStream = fs.createReadStream(filePath);
//
//     const myStream: fs.ReadStream = await new Promise((resolve, reject) => {
//       fileStream.on('readable', function () {
//         resolve(fileStream);
//       });
//
//       fileStream.on('error', function (error) {
//         reject(error);
//       });
//     });
//
//     return myStream;
//   } catch (error) {
//     const errorMessage = `could not create file stream at path ${filePath}`;
//     console.log(errorMessage, error);
//     throw new Error(errorMessage);
//   }
// };
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