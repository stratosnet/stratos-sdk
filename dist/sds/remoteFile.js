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
exports.downloadSharedFile = exports.getSharedFileList = exports.stopFileSharing = exports.shareFile = exports.updloadFileFromBuffer = exports.updloadFile = exports.downloadFile = exports.getUploadedFileList = exports.getUploadedFilesStatus = exports.UPLOAD_CODES = void 0;
const path_1 = __importDefault(require("path"));
const accounts = __importStar(require("../accounts"));
const remotefs_1 = require("../config/remotefs");
const keyUtils = __importStar(require("../hdVault/keyUtils"));
const FilesystemService = __importStar(require("../services/filesystem"));
const helpers_1 = require("../services/helpers");
const Network = __importStar(require("../services/network"));
const network_1 = require("../services/network");
exports.UPLOAD_CODES = {
    GET_FILE_STATUS: 1,
    GET_FILE_STATUS_NO_RESPONSE: 2,
    GET_FILE_STATUS_NOT_NUMBER: 3,
    USER_REQUEST_UPLOAD_ERROR: 4,
    USER_REQUEST_UPLOAD_FILE_ALREADY_SENT: 5,
    USER_REQUEST_UPLOAD_NO_OFFSET_END: 6,
    USER_REQUEST_UPLOAD_NO_OFFSET_START: 7,
    USER_UPLOAD_DATA_REQUEST_SENT: 8,
    USER_UPLOAD_DATA_PROCESS_STOPPED: 9,
    USER_UPLOAD_DATA_PROCESS_STOP_FAIL: 10,
    USER_UPLOAD_DATA_NO_FILE_CHUNK: 11,
    USER_UPLOAD_DATA_FILE_CHUNK_CORRECT: 12,
    USER_UPLOAD_DATA_NO_RESPONSE: 13,
    USER_UPLOAD_DATA_NO_ID_IN_RESPONSE: 14,
    USER_UPLOAD_DATA_RESPONSE_CORRECT: 15,
    USER_UPLOAD_DATA_NO_OFFSET_END: 16,
    USER_UPLOAD_DATA_NO_OFFSET_START: 17,
    USER_UPLOAD_DATA_COMPLETED: 18,
    USER_UPLOAD_DATA_NO_CONTINUE: 19,
    USER_UPLOAD_DATA_FINISHED: 20,
};
const processUsedFileDownload = async (responseRequestDownloadShared, filehash, filesize) => {
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
    let dlPartSize = offsetEndGlobal - 1 - offsetStartGlobal;
    readSize = readSize + dlPartSize;
    completedProgress = (100 * readSize) / filesize;
    const completedProgressMessage = `completed ${readSize} from ${filesize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(2)}%`;
    (0, helpers_1.log)('2 We have a correct responseRequestDownload', completedProgressMessage);
    while (isContinueGlobal === 2) {
        const extraParamsForUserDownload = [
            {
                filehash,
                reqid: reqidDownloadShared,
            },
        ];
        const callResultDownload = await Network.sendUserDownloadData(extraParamsForUserDownload);
        const { response: responseDownload } = callResultDownload;
        if (!responseDownload) {
            (0, helpers_1.dirLog)('-- ERROR processUsedFileDownload - we dont have response. it might be an error', callResultDownload);
            return;
        }
        const { return: dlReturn, offsetstart: dlOffsetstart, offsetend: dlOffsetend } = responseDownload.result;
        const responseDownloadFormatted = { dlReturn, dlOffsetstart, dlOffsetend };
        (0, helpers_1.dirLog)('ResponseDownloadFormatted (without downloadedFileData)', responseDownloadFormatted);
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
            dlPartSize = offsetEndGlobal - 1 - offsetStartGlobal;
            readSize = readSize + dlPartSize;
            completedProgress = (100 * readSize) / filesize;
            const completedProgressMessage = `completed ${readSize} from ${filesize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(2)}%`;
            (0, helpers_1.log)('3 We have a correct responseDownload', completedProgressMessage);
        }
    }
    let downloadConfirmed = '-1';
    if (isContinueGlobal === 3) {
        const extraParamsForUserDownload = [
            {
                filehash,
                reqid: reqidDownloadShared,
            },
        ];
        const callResultDownloadFileInfo = await Network.sendUserDownloadedFileInfo(extraParamsForUserDownload);
        (0, helpers_1.dirLog)('Call result download', callResultDownloadFileInfo);
        const { response: responseDownloadFileInfo } = callResultDownloadFileInfo;
        downloadConfirmed = ((_a = responseDownloadFileInfo === null || responseDownloadFileInfo === void 0 ? void 0 : responseDownloadFileInfo.result) === null || _a === void 0 ? void 0 : _a.return) || '-1';
        (0, helpers_1.log)('ResponseDownloadFileInfo', responseDownloadFileInfo);
    }
    if (+downloadConfirmed !== 0) {
        throw new Error('could not get download confirmation');
    }
    const sortedFileInfoChunks = fileInfoChunks.sort((a, b) => {
        const res = a.offsetstart - b.offsetstart;
        return res;
    });
    const encodedFileChunks = sortedFileInfoChunks
        .map(fileInfoChunk => {
        // log('offsetstart, offsetend', fileInfoChunk.offsetstart, fileInfoChunk.offsetend);
        return fileInfoChunk.filedata || '';
    })
        .filter(Boolean);
    const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);
    const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
    return decodedFile;
};
const getUploadedFilesStatus = async (keypair, fileHash, progressCb = () => { }) => {
    const { address, publicKey } = keypair;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageForUploadStatusToSign = `${fileHash}${address}${timestamp}`;
    const signatureForUploadStatus = await keyUtils.signWithPrivateKey(messageForUploadStatusToSign, keypair.privateKey);
    const extraParamsForGetFileStatus = [
        {
            filehash: fileHash,
            signature: {
                address,
                pubkey: publicKey,
                signature: signatureForUploadStatus,
            },
            req_time: timestamp,
        },
    ];
    const callResultGetFileStatus = await Network.sendUserRequestGetFileStatus(extraParamsForGetFileStatus);
    // log('call result get file status (end)', JSON.stringify(callResultGetFileStatus));
    progressCb({
        result: {
            success: true,
            code: exports.UPLOAD_CODES.GET_FILE_STATUS,
            message: 'call result get file status (end)',
            details: {
                callResultGetFileStatus,
            },
        },
    });
    const { response: responseGetFileStatus } = callResultGetFileStatus;
    if (!responseGetFileStatus) {
        // dirLog(
        //   'we dont have response for get file status request. it might be an error',
        //   callResultGetFileStatus,
        // );
        const errorMsg = 'we dont have response for get file status request. it might be an error';
        progressCb({
            result: {
                success: false,
                code: exports.UPLOAD_CODES.GET_FILE_STATUS_NO_RESPONSE,
            },
            error: {
                message: errorMsg,
                details: { responseGetFileStatus, callResultGetFileStatus },
            },
        });
        throw new Error(errorMsg);
    }
    const { result: updloadedFileStatusResult } = responseGetFileStatus;
    const { return: requestGetFileStatusReturn, file_upload_state: fileUploadState, user_has_file: userHasFile, replicas, } = updloadedFileStatusResult;
    if (parseInt(requestGetFileStatusReturn, 10) !== 0) {
        // throw new Error(
        //   `return field in the request get file status response contains an error. Error code "${requestGetFileStatusReturn}"`,
        // );
        const errorMsg = `return field in the file status response has an error. It must be equal to 0. Error code "${requestGetFileStatusReturn}"`;
        progressCb({
            result: { success: false, code: exports.UPLOAD_CODES.GET_FILE_STATUS_NOT_NUMBER },
            error: {
                message: errorMsg,
                details: { responseGetFileStatus, callResultGetFileStatus },
            },
        });
        throw new Error(errorMsg);
    }
    const fileStatusInfo = {
        fileHash,
        fileUploadState,
        userHasFile,
        replicas,
        requestGetFileStatusReturn,
    };
    return fileStatusInfo;
};
exports.getUploadedFilesStatus = getUploadedFilesStatus;
const getUploadedFileList = async (keypair, page = 0) => {
    const { address, publicKey } = keypair;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${address}${timestamp}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = [
        {
            walletaddr: address,
            page,
            signature: {
                address,
                pubkey: publicKey,
                signature,
            },
            req_time: timestamp,
        },
    ];
    const callResult = await (0, network_1.sendUserRequestList)(extraParams);
    const { response } = callResult;
    if (!response) {
        throw 'Could not fetch a list of files. No response in the call result';
    }
    const userFiles = response.result.fileinfo;
    return {
        originalResponse: response,
        files: userFiles,
    };
};
exports.getUploadedFileList = getUploadedFileList;
const downloadFile = async (keypair, filePathToSave, filehash, filesize) => {
    const { address, publicKey } = keypair;
    const sequence = await getCurrentSequenceString(address);
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
    const callResultRequestDl = await Network.sendUserRequestDownload(extraParams);
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
    const decodedFile = await processUsedFileDownload(responseRequestDl, filehash, filesize);
    if (!decodedFile) {
        throw new Error(`Could not process download of the user file for the "${filehash}" into "${filePathToSave}"`);
    }
    (0, helpers_1.log)(`Downloaded user file will be saved into ${filePathToSave}`, filePathToSave);
    FilesystemService.writeFile(filePathToSave, decodedFile);
    return { filePathToSave };
};
exports.downloadFile = downloadFile;
const getCurrentSequenceString = async (address) => {
    const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);
    const { detailedBalance } = ozoneBalance;
    if (!detailedBalance) {
        throw new Error('no sequence is presented in the ozone balance response');
    }
    const { sequence } = detailedBalance;
    return sequence;
};
const getUserRequestUploadParams = async (keypair, filehash, filename, filesize) => {
    const { address, publicKey } = keypair;
    const sequence = await getCurrentSequenceString(address);
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${filehash}${address}${sequence}${timestamp}`;
    // log('MessageToSign for userRequestUpload', messageToSign);
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = [
        {
            filename,
            filesize: filesize,
            filehash: filehash,
            signature: {
                address,
                pubkey: publicKey,
                signature,
            },
            req_time: timestamp,
            sequencenumber: sequence,
        },
    ];
    return extraParams;
};
const getOffsetsAndResultFromRequestUpload = async (extraParams) => {
    const callResultInit = await Network.sendUserRequestUpload(extraParams);
    const { response: responseInit } = callResultInit;
    // log('call result init (end of init)', JSON.stringify(callResultInit));
    const errorsList = [];
    if (!responseInit) {
        errorsList.push(`params for sendUserRequestUpload which we had when the error occured. ${JSON.stringify(extraParams)}`);
        errorsList.push('we dont have response. it might be an error.');
        // log('params for sendUserRequestUpload which we had when the error occured', extraParams);
        // log('we dont have response. it might be an error', callResultInit);
        // throw new Error('we dont have response. it might be an error');
        return { responseInit, isContinueInit: 0, callResultInit, errorsList };
    }
    const { result: resultWithOffesets } = responseInit;
    const { offsetend: offsetendInit, offsetstart: offsetstartInit, return: isContinueInit, } = resultWithOffesets;
    return { offsetstartInit, offsetendInit, isContinueInit, responseInit, callResultInit, errorsList };
};
const getUserUploadDataParams = async (keypair, filehash, encodedFileChunk, stop = false) => {
    const { address, publicKey } = keypair;
    const timestampForUpload = (0, helpers_1.getTimestampInSeconds)();
    const sequenceUpload = await getCurrentSequenceString(address);
    const messageToSignForUpload = `${filehash}${address}${sequenceUpload}${timestampForUpload}`;
    const signatureForUpload = await keyUtils.signWithPrivateKey(messageToSignForUpload, keypair.privateKey);
    const extraParamsForUpload = [
        {
            filehash: filehash,
            data: encodedFileChunk,
            signature: {
                address,
                pubkey: publicKey,
                signature: signatureForUpload,
            },
            req_time: timestampForUpload,
            sequencenumber: sequenceUpload,
        },
    ];
    if (stop) {
        extraParamsForUpload[0].stop = true;
    }
    return extraParamsForUpload;
};
const updloadFile = async (keypair, fileReadPath) => {
    const imageFileName = path_1.default.basename(fileReadPath);
    const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
    const readBinaryFile = await FilesystemService.getFileBuffer(fileReadPath);
    return (0, exports.updloadFileFromBuffer)(keypair, readBinaryFile, imageFileName, fileInfo.filehash, fileInfo.size);
};
exports.updloadFile = updloadFile;
/*
 * @depricated replaced with updloadFileFromBuffer + uploadFile
 * */
// export const updloadFileV1 = async (
//   keypair: wallet.KeyPairInfo,
//   fileReadPath: string,
// ): Promise<{ uploadReturn: string; filehash: string; fileStatusInfo: UploadedFileStatusInfo }> => {
//   const imageFileName = path.basename(fileReadPath);
//
//   const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
//
//   const fileSize = fileInfo.size;
//
//   const extraParams = await getUserRequestUploadParams(
//     keypair,
//     fileInfo.filehash,
//     imageFileName,
//     fileInfo.size,
//   );
//
//   const { responseInit, offsetstartInit, offsetendInit, isContinueInit } =
//     await getOffsetsAndResultFromRequestUpload(extraParams);
//
//   let offsetStartGlobal;
//   let offsetEndGlobal;
//   let isContinueGlobal = 0;
//
//   let responseInitGlobal = responseInit;
//
//   isContinueGlobal = +isContinueInit;
//
//   offsetStartGlobal = offsetstartInit!;
//   offsetEndGlobal = offsetendInit!;
//
//   if (isContinueGlobal === -13) {
//     log('looks like the file was already sent. will try to reset its progress');
//
//     const extraParamsForUpload = await getUserUploadDataParams(keypair, fileInfo.filehash, '', true);
//
//     let callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);
//
//     const { response: responseUploadToTest } = callResultUpload;
//
//     log('responseUploadToTest after sending the stop to sendUserUploadData', responseUploadToTest);
//
//     try {
//       const {
//         result: { return: returnStop },
//       } = responseUploadToTest!;
//
//       if (+returnStop === -14) {
//         log('we have stopped the upload succesfully. sending request upload again');
//
//         const { responseInit, offsetstartInit, offsetendInit, isContinueInit } =
//           await getOffsetsAndResultFromRequestUpload(extraParams);
//
//         responseInitGlobal = responseInit;
//         isContinueGlobal = +isContinueInit;
//
//         offsetStartGlobal = +offsetstartInit!;
//         offsetEndGlobal = +offsetendInit!;
//       }
//     } catch (error) {
//       console.log('error of stopping the upload', error);
//       throw Error('we could not stop the upload. Exiting. try agian later');
//     }
//   }
//
//   if (offsetEndGlobal === undefined) {
//     log('we dont have an offest end for init. could be an error. response is', responseInitGlobal);
//
//     throw new Error('we dont have an offest end for init. could be an error.');
//   }
//
//   if (offsetStartGlobal === undefined) {
//     log('we dont have an offest start for init. could be an error. response is', responseInitGlobal);
//     throw new Error('we dont have an offest start for init. could be an error.');
//   }
//
//   let readSize = 0;
//   let completedProgress = 0;
//
//   offsetStartGlobal = +offsetStartGlobal;
//   offsetEndGlobal = +offsetEndGlobal;
//
//   const readBinaryFile = await FilesystemService.getFileBuffer(fileReadPath);
//
//   let uploadReturn = '';
//
//   while (isContinueGlobal === 1) {
//     const fileChunk = readBinaryFile.slice(offsetStartGlobal, offsetEndGlobal);
//
//     if (!fileChunk) {
//       log('fileChunk is missing, Exiting ', fileChunk);
//       throw new Error('fileChunk is missing. Exiting');
//     }
//
//     if (fileChunk) {
//       const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
//
//       readSize = readSize + fileChunk.length;
//
//       completedProgress = (100 * readSize) / fileSize;
//
//       const completedProgressMessage = `completed ${readSize} from ${fileSize} bytes, or ${(
//         Math.round(completedProgress * 100) / 100
//       ).toFixed(2)}%`;
//
//       let responseUpload;
//
//
//       do {
//         const extraParamsForUpload = await getUserUploadDataParams(
//           keypair,
//           fileInfo.filehash,
//           encodedFileChunk,
//         );
//
//         let callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);
//
//         const { response: responseUploadToTest } = callResultUpload;
//
//         if (!responseUploadToTest) {
//           log('-- ERROR 1 -- call result upload (end)', JSON.stringify(callResultUpload));
//           log('-- ERROR 1 we dont have upload response. it might be an error', callResultUpload);
//           continue;
//         }
//
//         if (!responseUploadToTest.id || !!responseUploadToTest.error) {
//           log('ERROR 2 --- we dont have upload response id or ie has an error.', callResultUpload);
//           log('ERROR 2a --- error.', callResultUpload.response?.error);
//           continue;
//         }
//         responseUpload = responseUploadToTest;
//         log('we have a correct responseUpload', completedProgressMessage);
//       } while (!responseUpload);
//
//       const {
//         result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload },
//       } = responseUpload;
//
//       uploadReturn = isContinueUpload;
//
//       isContinueGlobal = +isContinueUpload;
//
//       if (offsetendUpload === undefined) {
//         log('--- ERROR 3 - we dont have an offest. could be an error. response is', responseUpload);
//         break;
//       }
//
//       if (offsetstartUpload === undefined) {
//         log('--- ERROR 4 - we dont have an offest. could be an error. response is', responseUpload);
//         break;
//       }
//
//       offsetStartGlobal = +offsetstartUpload;
//       offsetEndGlobal = +offsetendUpload;
//     }
//   }
//
//   log(`The latest upload request return code / value is "${uploadReturn}"`);
//
//   if (isContinueGlobal !== 0) {
//     log('oh no!!! isContinueGlobal', isContinueGlobal);
//
//     const errorMsg = `There was an error during the upload. "return" from the request is "${isContinueGlobal}"`;
//     throw new Error(errorMsg);
//   }
//
//   let updloadedFileStateGlobal = 2; // failed
//   let fileStatusInfoGlobal: UploadedFileStatusInfo;
//   let attemptsCount = 0;
//
//   do {
//     attemptsCount += 1;
//
//     const fileStatusInfo = await getUploadedFilesStatus(keypair, fileInfo.filehash);
//     const { fileUploadState } = fileStatusInfo;
//     fileStatusInfoGlobal = fileStatusInfo;
//
//     updloadedFileStateGlobal = fileUploadState;
//
//     await delay(FILE_STATUS_CHECK_WAIT_TIME);
//   } while (attemptsCount <= FILE_STATUS_CHECK_MAX_ATTEMPTS && updloadedFileStateGlobal !== 3);
//
//   const uploadResult = {
//     uploadReturn,
//     filehash: fileInfo.filehash,
//     fileStatusInfo: fileStatusInfoGlobal,
//   };
//
//   console.log('Uploaded filehash: ', fileInfo.filehash);
//
//   return uploadResult;
// };
//
const updloadFileFromBuffer = async (keypair, fileBuffer, resolvedFileName, fileHash, fileSize, progressCb = () => { }) => {
    // console.log('given fileBuffer to the sdk', fileBuffer);
    var _a;
    const extraParams = await getUserRequestUploadParams(keypair, fileHash, resolvedFileName, fileSize);
    // console.log('extraParams for getUserRequestUploadParams', extraParams);
    const { errorsList: initErrorsList, responseInit, callResultInit, offsetstartInit, offsetendInit, isContinueInit, } = await getOffsetsAndResultFromRequestUpload(extraParams);
    if (initErrorsList.length) {
        const errorMsg = 'sendUserRequestUpload has returned an error';
        progressCb({
            result: { success: false, code: exports.UPLOAD_CODES.USER_REQUEST_UPLOAD_ERROR },
            error: {
                message: errorMsg,
                details: { initErrorsList, callResultInit, responseInit },
            },
        });
        throw Error(errorMsg);
    }
    let offsetStartGlobal;
    let offsetEndGlobal;
    let isContinueGlobal = 0;
    let responseInitGlobal = responseInit;
    isContinueGlobal = +isContinueInit;
    offsetStartGlobal = offsetstartInit;
    offsetEndGlobal = offsetendInit;
    if (isContinueGlobal === -13) {
        // log('looks like the file was already sent. will try to reset its progress');
        const errorMsg = 'looks like the file was already sent. will try to reset its progress';
        progressCb({
            result: { success: false, code: exports.UPLOAD_CODES.USER_REQUEST_UPLOAD_FILE_ALREADY_SENT },
            error: {
                message: errorMsg,
                details: { isContinueGlobal },
            },
        });
        const extraParamsForUpload = await getUserUploadDataParams(keypair, fileHash, '', true);
        let callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);
        const { response: responseUploadToTest } = callResultUpload;
        // log(, responseUploadToTest);
        const resMsg = 'responseUploadToTest after sending the stop to sendUserUploadData';
        progressCb({
            result: { success: true, message: resMsg, code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_REQUEST_SENT },
        });
        try {
            const { result: { return: returnStop }, } = responseUploadToTest;
            if (+returnStop === -14) {
                // log('we have stopped the upload succesfully. sending request upload again');
                const resMsg = 'we have stopped the upload succesfully. sending request upload again';
                progressCb({
                    result: {
                        success: true,
                        code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_PROCESS_STOPPED,
                        message: resMsg,
                        details: { returnStop },
                    },
                });
                const { responseInit, offsetstartInit, offsetendInit, isContinueInit } = await getOffsetsAndResultFromRequestUpload(extraParams);
                responseInitGlobal = responseInit;
                isContinueGlobal = +isContinueInit;
                offsetStartGlobal = +offsetstartInit;
                offsetEndGlobal = +offsetendInit;
            }
        }
        catch (error) {
            // console.log('error of stopping the upload', error);
            const errorMsg = 'we could not stop the upload. Exiting. try agian later';
            progressCb({
                result: { success: false, code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_PROCESS_STOP_FAIL },
                error: {
                    message: errorMsg,
                    details: error,
                },
            });
            throw Error(errorMsg);
        }
    }
    if (offsetEndGlobal === undefined) {
        // log('we dont have an offest end for init. could be an error. response is', responseInitGlobal);
        const errorMsg = 'we dont have an offest end for init. could be an error.';
        progressCb({
            result: { success: false, code: exports.UPLOAD_CODES.USER_REQUEST_UPLOAD_NO_OFFSET_END },
            error: {
                message: errorMsg,
                details: { offsetEndGlobal, responseInitGlobal },
            },
        });
        throw Error(errorMsg);
    }
    if (offsetStartGlobal === undefined) {
        // log('we dont have an offest start for init. could be an error. response is', responseInitGlobal);
        const errorMsg = 'we dont have an offest start for init. could be an error.';
        progressCb({
            result: { success: false, code: exports.UPLOAD_CODES.USER_REQUEST_UPLOAD_NO_OFFSET_START },
            error: {
                message: errorMsg,
                details: { offsetStartGlobal, responseInitGlobal },
            },
        });
        throw Error(errorMsg);
    }
    let readSize = 0;
    let completedProgress = 0;
    offsetStartGlobal = +offsetStartGlobal;
    offsetEndGlobal = +offsetEndGlobal;
    const readBinaryFile = fileBuffer;
    // console.log('readBinaryFile after assignment', readBinaryFile);
    // console.log('fileBuffer after assignment', fileBuffer);
    let uploadReturn = '';
    while (isContinueGlobal === 1) {
        // console.log('offsetStartGlobal', offsetStartGlobal);
        // console.log('offsetEndGlobal', offsetEndGlobal);
        const fileChunk = readBinaryFile.slice(offsetStartGlobal, offsetEndGlobal);
        // console.log('fileChunk slice', fileChunk);
        if (!fileChunk) {
            // log('fileChunk is missing, Exiting ', fileChunk);
            const errorMsg = 'fileChunk is missing. Exiting';
            progressCb({
                result: { success: false, code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_NO_FILE_CHUNK },
                error: {
                    message: errorMsg,
                    details: { fileChunk },
                },
            });
            throw Error(errorMsg);
        }
        if (fileChunk) {
            const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
            readSize = readSize + fileChunk.length;
            // console.log('fileChunk.length', fileChunk.length);
            // console.log('readSize', readSize);
            completedProgress = (100 * readSize) / fileSize;
            const completedPercentage = (Math.round(completedProgress * 100) / 100).toFixed(2);
            const completedProgressMessage = `completed ${readSize} from ${fileSize} bytes, or ${completedPercentage}%`;
            progressCb({
                result: {
                    message: 'we have a correct buffer chunk ' + completedProgressMessage,
                    code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_FILE_CHUNK_CORRECT,
                    success: true,
                    details: {
                        completedProgress: {
                            completedBytes: readSize,
                            totalBytes: fileSize,
                            completedPercentage,
                        },
                    },
                },
            });
            let responseUpload;
            do {
                const extraParamsForUpload = await getUserUploadDataParams(keypair, fileHash, encodedFileChunk);
                let callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);
                const { response: responseUploadToTest } = callResultUpload;
                if (!responseUploadToTest) {
                    // log('-- ERROR 1 -- call result upload (end)', JSON.stringify(callResultUpload));
                    // log('-- ERROR 1 we dont have upload response. it might be an error', callResultUpload);
                    const errorMsg = '-- ERROR 1 we dont have upload response. it might be an error';
                    progressCb({
                        result: { success: false, code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_NO_RESPONSE },
                        error: {
                            message: errorMsg,
                            details: { callResultUpload },
                        },
                    });
                    continue;
                }
                if (!responseUploadToTest.id || !!responseUploadToTest.error) {
                    // log('ERROR 2 --- we dont have upload response id or ie has an error.', callResultUpload);
                    // log('ERROR 2a --- error.', callResultUpload.response?.error);
                    const errorMsg = `ERROR 2 --- we dont have upload response id or it has an error. ${JSON.stringify(callResultUpload)}`;
                    progressCb({
                        result: { success: false, code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_NO_ID_IN_RESPONSE },
                        error: {
                            message: errorMsg,
                            details: {
                                callResultUpload,
                                callResultUploadError: (_a = callResultUpload.response) === null || _a === void 0 ? void 0 : _a.error,
                            },
                        },
                    });
                    continue;
                }
                responseUpload = responseUploadToTest;
                // log('we have a correct responseUpload', completedProgressMessage);
                progressCb({
                    result: {
                        success: true,
                        code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_RESPONSE_CORRECT,
                        message: `uploaded ${completedPercentage}%`,
                        details: {
                            completedProgress: {
                                responseUpload,
                                completedBytes: readSize,
                                totalBytes: fileSize,
                                completedPercentage,
                            },
                        },
                    },
                });
            } while (!responseUpload);
            const { result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload }, } = responseUpload;
            uploadReturn = isContinueUpload;
            isContinueGlobal = +isContinueUpload;
            if (offsetendUpload === undefined) {
                // log('--- ERROR 3 - we dont have an offest. could be an error. response is', responseUpload);
                const errorMsg = `--- ERROR 3 - we dont have an offest. could be an error. response is:  ${JSON.stringify(responseUpload)}`;
                // log(errorMsg, responseUpload);
                progressCb({
                    result: {
                        success: false,
                        code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_NO_OFFSET_END,
                        message: errorMsg,
                        details: { offsetendUpload },
                    },
                    // error: {
                    //   message: errorMsg,
                    //   details: { offsetendUpload },
                    // },
                });
                break;
            }
            if (offsetstartUpload === undefined) {
                const errorMsg = `--- ERROR 4 - we dont have an offest. could be an error. response is:  ${JSON.stringify(responseUpload)}`;
                // log(errorMsg, responseUpload);
                progressCb({
                    result: { success: false, code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_NO_OFFSET_START },
                    error: {
                        message: errorMsg,
                        details: { offsetstartUpload },
                    },
                });
                break;
            }
            offsetStartGlobal = +offsetstartUpload;
            offsetEndGlobal = +offsetendUpload;
        }
    }
    // log(`The latest upload request return code / value is "${uploadReturn}"`);
    progressCb({
        result: {
            success: true,
            code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_COMPLETED,
            message: `the latest upload return code / value is: ${uploadReturn}`,
            details: { uploadReturn },
        },
    });
    if (isContinueGlobal !== 0) {
        // log('oh no!!! isContinueGlobal', isContinueGlobal);
        const errorMsg = `There was an error during the upload. "return" from the request is "${isContinueGlobal}" , Details: (${uploadReturn})`;
        progressCb({
            result: { success: false, code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_NO_CONTINUE },
            error: {
                message: errorMsg,
                details: { isContinueGlobal, uploadReturn },
            },
        });
        throw new Error(errorMsg);
    }
    let updloadedFileStateGlobal = 2; // failed
    let fileStatusInfoGlobal;
    let attemptsCount = 0;
    do {
        attemptsCount += 1;
        const fileStatusInfo = await (0, exports.getUploadedFilesStatus)(keypair, fileHash);
        const { fileUploadState } = fileStatusInfo;
        fileStatusInfoGlobal = fileStatusInfo;
        updloadedFileStateGlobal = fileUploadState;
        await (0, helpers_1.delay)(remotefs_1.FILE_STATUS_CHECK_WAIT_TIME);
    } while (attemptsCount <= remotefs_1.FILE_STATUS_CHECK_MAX_ATTEMPTS && updloadedFileStateGlobal !== 3);
    const uploadResult = {
        uploadReturn,
        filehash: fileHash,
        fileStatusInfo: fileStatusInfoGlobal,
    };
    progressCb({
        result: {
            success: true,
            code: exports.UPLOAD_CODES.USER_UPLOAD_DATA_FINISHED,
            message: 'upload is finished',
            details: {
                uploadResult,
            },
        },
    });
    // console.log('Uploaded filehash: ', fileInfo.filehash);
    // console.log('Uploaded filehash: ', fileHash);
    return uploadResult;
};
exports.updloadFileFromBuffer = updloadFileFromBuffer;
const shareFile = async (keypair, filehash) => {
    const { address, publicKey } = keypair;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${filehash}${address}${timestamp}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = {
        filehash,
        duration: 0,
        bool: false,
        signature: {
            address,
            pubkey: publicKey,
            signature,
        },
        req_time: timestamp,
    };
    const callResultRequestShare = await Network.sendUserRequestShare([extraParams]);
    const { response: responseRequestShare } = callResultRequestShare;
    if (!responseRequestShare) {
        (0, helpers_1.dirLog)('we dont have response for start share request. it might be an error', callResultRequestShare);
        throw 'Could not start sharing the file. No response in the call result';
    }
    const userStartShareResult = responseRequestShare.result;
    const { return: requestReturn, shareid, sharelink } = userStartShareResult;
    if (parseInt(requestReturn, 10) < 0) {
        throw new Error(`return field in the response contains an error. Error code "${requestReturn}"`);
    }
    if (parseInt(requestReturn, 10) !== 0) {
        throw new Error(`return field in the response contains an unexpected code "${requestReturn}". Expected code was "0"`);
    }
    if (!sharelink || !shareid) {
        (0, helpers_1.dirLog)('Error: No required fields are presented in the response.', userStartShareResult);
        throw new Error(`Could not share file with hash "${filehash}". No required "shareid" and "sharelink" in the response`);
    }
    return {
        filehash,
        sharelink,
        shareid,
    };
};
exports.shareFile = shareFile;
const stopFileSharing = async (keypair, shareid) => {
    const { address, publicKey } = keypair;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${shareid}${address}${timestamp}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = {
        shareid,
        signature: {
            address,
            pubkey: publicKey,
            signature,
        },
        req_time: timestamp,
    };
    const callResultRequestStopShare = await Network.sendUserRequestStopShare([extraParams]);
    const { response: responseRequestStopShare } = callResultRequestStopShare;
    if (!responseRequestStopShare) {
        (0, helpers_1.dirLog)('we dont have response for stop share request. it might be an error', callResultRequestStopShare);
        throw 'Could not stop sharing the file. No response in the call result';
    }
    const userStopShareResult = responseRequestStopShare.result;
    const { return: requestReturn } = userStopShareResult;
    if (parseInt(requestReturn, 10) < 0) {
        throw new Error(`return field in the response contains an error. Error code "${requestReturn}"`);
    }
    if (parseInt(requestReturn, 10) !== 0) {
        throw new Error(`return field in the response contains an unexpected code "${requestReturn}". Expected code was "0"`);
    }
    return true;
};
exports.stopFileSharing = stopFileSharing;
const getSharedFileList = async (keypair, page = 0) => {
    const { address, publicKey } = keypair;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${address}${timestamp}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = {
        page,
        signature: {
            address,
            pubkey: publicKey,
            signature,
        },
        req_time: timestamp,
    };
    const callResultRequestListShare = await Network.sendUserRequestListShare([extraParams]);
    const { response: responseRequestListShare } = callResultRequestListShare;
    if (!responseRequestListShare) {
        (0, helpers_1.dirLog)('we dont have response for list share request. it might be an error', callResultRequestListShare);
        throw new Error('Could not fetch a list of shared files. No response in the call result');
    }
    const userSharedFiles = responseRequestListShare.result;
    const { totalnumber, fileinfo, return: requestReturn } = userSharedFiles;
    if (parseInt(requestReturn, 10) < 0) {
        throw new Error(`return field in the response contains an error. Error code "${requestReturn}"`);
    }
    if (parseInt(requestReturn, 10) !== 0) {
        throw new Error(`return field in the response contains an unexpected code "${requestReturn}". Expected code was "0"`);
    }
    if (!fileinfo || !totalnumber) {
        return {
            files: [],
            totalnumber: 0,
        };
    }
    return {
        files: fileinfo,
        totalnumber,
    };
};
exports.getSharedFileList = getSharedFileList;
const downloadSharedFile = async (keypair, filePathToSave, sharelink, filesize) => {
    (0, helpers_1.log)(filePathToSave);
    const { address, publicKey } = keypair;
    const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);
    const { detailedBalance } = ozoneBalance;
    if (!detailedBalance) {
        throw new Error('no sequence is presented in the ozone balance response');
    }
    const timestampA = (0, helpers_1.getTimestampInSeconds)();
    const messageToSignA = `${sharelink}${address}${timestampA}`;
    const signatureA = await keyUtils.signWithPrivateKey(messageToSignA, keypair.privateKey);
    const extraParams = {
        signature: {
            address,
            pubkey: publicKey,
            signature: signatureA,
        },
        req_time: timestampA,
        sharelink,
    };
    const callResultRequestGetShared = await Network.sendUserRequestGetShared([extraParams]);
    const { response: responseRequestGetShared } = callResultRequestGetShared;
    if (!responseRequestGetShared) {
        (0, helpers_1.dirLog)('we dont have response for dl request. it might be an error', callResultRequestGetShared);
        throw new Error('We dont have response to request get shared call');
    }
    const { return: requestGetSharedReturn, reqid, filehash, sequencenumber } = responseRequestGetShared.result;
    if (parseInt(requestGetSharedReturn, 10) < 0) {
        throw new Error(`return field in the request get shared response contains an error. Error code "${requestGetSharedReturn}"`);
    }
    if (parseInt(requestGetSharedReturn, 10) !== 4) {
        throw new Error(`return field in the response to request get shared has an unexpected code "${requestGetSharedReturn}". Expected code was "4"`);
    }
    if (!reqid || !filehash || !sequencenumber) {
        (0, helpers_1.dirLog)('we dont have required fields in the response ', responseRequestGetShared);
        throw new Error('required fields "reqid" or "filehash" or "sequencenumber" are missing in the response');
    }
    // const timestamp = getTimestampInSeconds();
    const messageToSign = `${filehash}${address}${sequencenumber}${timestampA}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParamsForDownload = {
        filehash,
        signature: {
            address,
            pubkey: publicKey,
            signature,
        },
        reqid,
        req_time: timestampA,
    };
    const callResultRequestDownloadShared = await Network.sendUserRequestDownloadShared([
        extraParamsForDownload,
    ]);
    const { response: responseRequestDownloadShared } = callResultRequestDownloadShared;
    if (!responseRequestDownloadShared) {
        (0, helpers_1.dirLog)('we dont have response for download shared request. it might be an error', callResultRequestDownloadShared);
        throw new Error('We dont have response to request download shared call');
    }
    const { result: resultWithOffesets } = responseRequestDownloadShared;
    const { return: requestDownloadSharedReturn, reqid: reqidDownloadShared, offsetstart: offsetstartInit, offsetend: offsetendInit, } = resultWithOffesets;
    if (parseInt(requestDownloadSharedReturn, 10) < 0) {
        throw new Error(`return field in the request download shared response contains an error. Error code "${requestDownloadSharedReturn}"`);
    }
    if (parseInt(requestDownloadSharedReturn, 10) !== 2) {
        throw new Error(`return field in the response to request download shared has an unexpected code "${requestDownloadSharedReturn}". Expected code was "4"`);
    }
    if (!reqidDownloadShared) {
        (0, helpers_1.dirLog)('we dont have required fields in the download shared response ', responseRequestDownloadShared);
        throw new Error('required fields "reqid"  is missing in the response');
    }
    if (offsetendInit === undefined) {
        (0, helpers_1.dirLog)('a we dont have an offest. could be an error. response is', responseRequestDownloadShared);
        return;
    }
    if (offsetstartInit === undefined) {
        (0, helpers_1.dirLog)('b we dont have an offest. could be an error. response is', responseRequestDownloadShared);
        return;
    }
    const decodedFile = await processUsedFileDownload(responseRequestDownloadShared, filehash, filesize);
    if (!decodedFile) {
        throw new Error(`Could not process download of the user shared file for the "${filehash}" into "${filePathToSave}"`);
    }
    (0, helpers_1.log)(`downloaded shared file will be saved into ${filePathToSave}`, filePathToSave);
    FilesystemService.writeFile(filePathToSave, decodedFile);
};
exports.downloadSharedFile = downloadSharedFile;
//# sourceMappingURL=remoteFile.js.map