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
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = exports.downloadFileToBuffer = exports.downloadFileOriginal = exports.processUsedFileDownload = void 0;
const keyUtils = __importStar(require("../../crypto/hdVault/keyUtils"));
const filesystem_1 = require("../../filesystem");
const network_1 = require("../../network");
const helpers_1 = require("../../services/helpers");
const remoteCommon_1 = require("./remoteCommon");
const SdsTypes = __importStar(require("./types"));
// actually downloads the file based on the offsets retrived inside the function
const processUsedFileDownload = async (responseRequestDownloadShared, filehash, filesize, progressCb = () => { }) => {
    var _a;
    const { result: resultWithOffesets } = responseRequestDownloadShared;
    let offsetStartGlobal = 0;
    let offsetEndGlobal = 0;
    let isContinueGlobal = 0;
    const fileInfoChunks = [];
    const { return: requestDownloadSharedReturn, reqid: reqidDownloadShared, offsetstart: offsetstartInit, offsetend: offsetendInit, filedata, } = resultWithOffesets;
    isContinueGlobal = +requestDownloadSharedReturn;
    offsetStartGlobal = +offsetstartInit;
    offsetEndGlobal = +offsetendInit;
    const fileChunk = { offsetstart: offsetStartGlobal, offsetend: offsetEndGlobal, filedata };
    fileInfoChunks.push(fileChunk);
    let readSize = 0;
    let completedProgress = 0;
    // 3145728 - 1 - 0 = 3145727
    const dlPartSizeToCheck = offsetEndGlobal - 1 - offsetStartGlobal;
    let dlPartSize = offsetEndGlobal === filesize ? filesize : dlPartSizeToCheck;
    readSize = readSize + dlPartSize;
    completedProgress = (100 * readSize) / filesize;
    const completedProgressPercentageA = (Math.round(completedProgress * 100) / 100).toFixed(2);
    const completedProgressMessageA = `completed ${readSize} from ${filesize} bytes, or ${completedProgressPercentageA}%`;
    const resMsg = `a. we have a correct responseRequestDownload, ${completedProgressMessageA} ___${completedProgressPercentageA}`;
    progressCb({
        result: {
            success: true,
            message: resMsg,
            code: SdsTypes.DOWNLOAD_CODES.WE_HAVE_CORRECT_RESPONSE_TO_REQUEST_DOWNLOAD,
            details: {
                filehash,
                percentDownloaded: completedProgressPercentageA,
            },
        },
    });
    while (isContinueGlobal === 2) {
        const extraParamsForUserDownload = [
            {
                filehash,
                reqid: reqidDownloadShared,
            },
        ];
        const callResultDownload = await network_1.networkApi.sendUserDownloadData(extraParamsForUserDownload);
        const { response: responseDownload } = callResultDownload;
        if (!responseDownload) {
            const errorMsg = '-- ERROR processUsedFileDownload - we dont have response. it might be an error';
            progressCb({
                result: {
                    success: false,
                    code: SdsTypes.DOWNLOAD_CODES.PROCESS_USER_FILE_DOWNLOAD,
                },
                error: {
                    message: errorMsg,
                    details: { callResultDownload },
                },
            });
            return;
        }
        const { result: { offsetend: offsetendDownload, offsetstart: offsetstartDownload, return: isContinueDownload, filedata: downloadedFileData, }, } = responseDownload;
        isContinueGlobal = +isContinueDownload;
        if (offsetstartDownload !== undefined && offsetendDownload !== undefined) {
            offsetStartGlobal = +offsetstartDownload;
            offsetEndGlobal = +offsetendDownload;
            const fileChunkDl = {
                offsetstart: offsetStartGlobal,
                offsetend: offsetEndGlobal,
                filedata: downloadedFileData,
            };
            fileInfoChunks.push(Object.assign({}, fileChunkDl));
            // 6291456  - 1 -  3145728  = 3145727
            dlPartSize = offsetEndGlobal - 1 - offsetStartGlobal;
            readSize = readSize + dlPartSize;
            completedProgress = (100 * readSize) / filesize;
            const completedProgressPercentageB = (Math.round(completedProgress * 100) / 100).toFixed(2);
            const completedProgressMessageC = `completed ${readSize} from ${filesize} bytes, or ${completedProgressPercentageB}%`;
            // log('3 We have a correct responseDownload', completedProgressMessage);
            const resMsgC = `b. we have a correct responseRequestDownload, ${completedProgressMessageC} ___${completedProgressPercentageB}`;
            progressCb({
                result: {
                    success: true,
                    message: resMsgC,
                    code: SdsTypes.DOWNLOAD_CODES.WE_HAVE_CORRECT_RESPONSE_TO_REQUEST_DOWNLOAD,
                    details: {
                        filehash,
                        percentDownloaded: completedProgressPercentageB,
                    },
                },
            });
        }
    }
    let downloadConfirmed = '-1';
    let callResultDownloadFileInfoDebug;
    if (isContinueGlobal === 3) {
        const extraParamsForUserDownload = [
            {
                filehash,
                reqid: reqidDownloadShared,
            },
        ];
        const callResultDownloadFileInfo = await network_1.networkApi.sendUserDownloadedFileInfo(extraParamsForUserDownload);
        callResultDownloadFileInfoDebug = callResultDownloadFileInfo;
        const { response: responseDownloadFileInfo } = callResultDownloadFileInfo;
        downloadConfirmed = ((_a = responseDownloadFileInfo === null || responseDownloadFileInfo === void 0 ? void 0 : responseDownloadFileInfo.result) === null || _a === void 0 ? void 0 : _a.return) || '-1';
    }
    if (+downloadConfirmed !== 0) {
        const errorMsg = 'could not get download confirmation';
        progressCb({
            result: {
                success: false,
                code: SdsTypes.DOWNLOAD_CODES.COULD_NOT_GET_DOWNLOAD_CONFIRMATION,
            },
            error: {
                message: errorMsg,
                details: { callResultDownloadFileInfoDebug },
            },
        });
        throw new Error(errorMsg);
    }
    const sortedFileInfoChunks = fileInfoChunks.sort((a, b) => {
        const res = a.offsetstart - b.offsetstart;
        return res;
    });
    const encodedFileChunks = sortedFileInfoChunks
        .map(fileInfoChunk => {
        return fileInfoChunk.filedata || '';
    })
        .filter(Boolean);
    const decodedChunksList = await filesystem_1.filesystemApi.decodeFileChunks(encodedFileChunks);
    const decodedFile = filesystem_1.filesystemApi.combineDecodedChunks(decodedChunksList);
    return decodedFile;
};
exports.processUsedFileDownload = processUsedFileDownload;
// 1 s - depricated
// uses processUsedFileDownload , which does not use sequence, so no changes needed
const downloadFileOriginal = async (keypair, filePathToSave, filehash, filesize) => {
    const { address, publicKey } = keypair;
    const sequence = await (0, remoteCommon_1.getCurrentSequenceString)(address);
    console.log('sequence', sequence);
    const filehandle = `sdm://${address}/${filehash}`;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${filehash}${address}${sequence}${timestamp}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = [
        {
            filehandle,
            signature: {
                address,
                pubkey: publicKey,
                signature,
            },
            req_time: timestamp,
        },
    ];
    const callResultRequestDl = await network_1.networkApi.sendUserRequestDownload(extraParams);
    const { response: responseRequestDl } = callResultRequestDl;
    if (!responseRequestDl) {
        (0, helpers_1.dirLog)('-- ERROR - we dont have response for dl request.', callResultRequestDl);
        throw new Error('we dont have response for dl request. it might be an error');
    }
    const { result: resultWithOffesets } = responseRequestDl;
    const { return: requestDownloadFileReturn, reqid: reqidDownloadFile, offsetstart: offsetstartInit, offsetend: offsetendInit, } = resultWithOffesets;
    if (parseInt(requestDownloadFileReturn, 10) < 0) {
        throw new Error(`return field in the request download shared response contains an error. Error code "${requestDownloadFileReturn}"`);
    }
    if (parseInt(requestDownloadFileReturn, 10) !== 2) {
        throw new Error(`return field in the response to request download shared has an unexpected code "${requestDownloadFileReturn}". Expected code was "4"`);
    }
    if (!reqidDownloadFile) {
        (0, helpers_1.dirLog)('we dont have required fields in the download shared response ', responseRequestDl);
        throw new Error('required fields "reqid"  is missing in the response');
    }
    if (offsetendInit === undefined) {
        (0, helpers_1.dirLog)('--- ERROR a we dont have an offest. could be an error. response is', responseRequestDl);
        throw new Error('a we dont have an offest. could be an error. response is');
    }
    if (offsetstartInit === undefined) {
        (0, helpers_1.dirLog)('--- ERROR b we dont have an offest. could be an error. response is', responseRequestDl);
        throw new Error('b we dont have an offest. could be an error. response is');
    }
    const decodedFile = await (0, exports.processUsedFileDownload)(responseRequestDl, filehash, filesize);
    if (!decodedFile) {
        throw new Error(`Could not process download of the user file for the "${filehash}" into "${filePathToSave}"`);
    }
    (0, helpers_1.log)(`Downloaded user file will be saved into ${filePathToSave}`, filePathToSave);
    filesystem_1.filesystemApi.writeFile(filePathToSave, decodedFile);
    return { filePathToSave };
};
exports.downloadFileOriginal = downloadFileOriginal;
// 2s uses processUsedFileDownload , which does not use sequence, so no changes needed
const downloadFileToBuffer = async (keypair, filehash, filesize, progressCb = () => { }) => {
    const { address, publicKey } = keypair;
    const sequence = await (0, remoteCommon_1.getCurrentSequenceString)(address);
    const filehandle = `sdm://${address}/${filehash}`;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${filehash}${address}${sequence}${timestamp}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = [
        {
            filehandle,
            signature: {
                address,
                pubkey: publicKey,
                signature,
            },
            req_time: timestamp,
        },
    ];
    const callResultRequestDl = await network_1.networkApi.sendUserRequestDownload(extraParams);
    const { response: responseRequestDl } = callResultRequestDl;
    if (!responseRequestDl) {
        const errorMsg = 'Error. There is no response for download request.';
        progressCb({
            result: { success: false, code: SdsTypes.DOWNLOAD_CODES.NO_RESPONSE_TO_DOWNLOAD_REQUEST },
            error: {
                message: errorMsg,
                details: { callResultRequestDl },
            },
        });
        throw new Error(errorMsg);
    }
    const { result: resultWithOffesets } = responseRequestDl;
    const { return: requestDownloadFileReturn, reqid: reqidDownloadFile, offsetstart: offsetstartInit, offsetend: offsetendInit, } = resultWithOffesets;
    if (parseInt(requestDownloadFileReturn, 10) < 0) {
        const errorMsg = `return field in the request download shared response contains an error. Error code "${requestDownloadFileReturn}"`;
        progressCb({
            result: { success: false, code: SdsTypes.DOWNLOAD_CODES.RETURN_FIELD_OF_REQUEST_DOWNLOAD_HAS_ERROR },
            error: {
                message: errorMsg,
                details: { responseRequestDl },
            },
        });
        throw new Error(errorMsg);
    }
    if (parseInt(requestDownloadFileReturn, 10) !== 2) {
        const errorMsg = `return field in the response to request download shared has an unexpected code "${requestDownloadFileReturn}". Expected code was "4"`;
        progressCb({
            result: {
                success: false,
                code: SdsTypes.DOWNLOAD_CODES.UNEXPECTED_CODE_IN_RETURN_FIELD_OF_REQUEST_DOWNLOAD,
            },
            error: {
                message: errorMsg,
                details: { responseRequestDl },
            },
        });
        throw new Error(errorMsg);
    }
    if (!reqidDownloadFile) {
        const errorMsg = 'required fields "reqid"  is missing in the response';
        progressCb({
            result: {
                success: false,
                code: SdsTypes.DOWNLOAD_CODES.REQUIRED_REQID_IS_MISSING_IN_THE_RESPONSE,
            },
            error: {
                message: errorMsg,
                details: { responseRequestDl },
            },
        });
        throw new Error(errorMsg);
    }
    if (offsetendInit === undefined) {
        const errorMsg = 'Error A. we dont have an offest. could be an error.';
        progressCb({
            result: {
                success: false,
                code: SdsTypes.DOWNLOAD_CODES.NO_OFFSET_ERROR_A,
            },
            error: {
                message: errorMsg,
                details: { responseRequestDl },
            },
        });
        throw new Error(errorMsg);
    }
    if (offsetstartInit === undefined) {
        const errorMsg = 'Error B. we dont have an offest. could be an error. ';
        progressCb({
            result: {
                success: false,
                code: SdsTypes.DOWNLOAD_CODES.NO_OFFSET_ERROR_B,
            },
            error: {
                message: errorMsg,
                details: { responseRequestDl },
            },
        });
        throw new Error(errorMsg);
    }
    const decodedFile = await (0, exports.processUsedFileDownload)(responseRequestDl, filehash, filesize, progressCb);
    if (!decodedFile) {
        const errorMsg = `Could not process download of the user file for the "${filehash}" into buffer`;
        progressCb({
            result: {
                success: false,
                code: SdsTypes.DOWNLOAD_CODES.COULD_NOT_PROCESS_DOWNLOAD_TO_BUFFER,
            },
            error: {
                message: errorMsg,
                details: { decodedFile },
            },
        });
        throw new Error(errorMsg);
    }
    return { downloadedFile: decodedFile };
};
exports.downloadFileToBuffer = downloadFileToBuffer;
const downloadFile = async (keypair, filePathToSave, filehash, filesize, progressCb = (data) => {
    console.log('data passed to callback', data);
}) => {
    const { downloadedFile } = await (0, exports.downloadFileToBuffer)(keypair, filehash, filesize, progressCb);
    if (!downloadedFile) {
        throw new Error(`Could not process download of the user file for the "${filehash}" into "${filePathToSave}"`);
    }
    (0, helpers_1.log)(`Downloaded user file will be saved into ${filePathToSave}`, filePathToSave);
    filesystem_1.filesystemApi.writeFile(filePathToSave, downloadedFile);
    return { filePathToSave };
};
exports.downloadFile = downloadFile;
//# sourceMappingURL=remoteDownload.js.map