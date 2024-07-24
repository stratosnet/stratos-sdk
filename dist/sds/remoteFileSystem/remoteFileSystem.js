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
exports.downloadSharedFile = exports.getSharedFileList = exports.stopFileSharing = exports.shareFile = exports.updloadFileFromBuffer = exports.updloadFile = exports.downloadFile = exports.downloadFileToBuffer = exports.downloadFileOriginal = exports.getAllUploadedFileList = exports.getUploadedFileList = exports.getUploadedFilesStatus = void 0;
const path_1 = __importDefault(require("path"));
const accounts_1 = require("../../accounts");
const remotefs_1 = require("../../config/remotefs");
const keyUtils = __importStar(require("../../crypto/hdVault/keyUtils"));
const filesystem_1 = require("../../filesystem");
const network_1 = require("../../network");
const helpers_1 = require("../../services/helpers");
const SdsTypes = __importStar(require("./types"));
const types_1 = require("./types");
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
    let dlPartSize = offsetEndGlobal - 1 - offsetStartGlobal;
    readSize = readSize + dlPartSize;
    completedProgress = (100 * readSize) / filesize;
    const completedProgressPercentage = (Math.round(completedProgress * 100) / 100).toFixed(2);
    //   const completedProgressMessage = `completed ${readSize} from ${filesize} bytes, or ${
    // ( Math.round(completedProgress * 100) / 100).toFixed(2)}%`;
    const completedProgressMessage = `completed ${readSize} from ${filesize} bytes, or ${completedProgressPercentage}%`;
    // log('2 We have a correct responseRequestDownload', completedProgressMessage);
    const resMsg = `a. we have a correct responseRequestDownload, ${completedProgressMessage} ___${completedProgressPercentage}`;
    progressCb({
        result: {
            success: true,
            message: resMsg,
            code: SdsTypes.DOWNLOAD_CODES.WE_HAVE_CORRECT_RESPONSE_TO_REQUEST_DOWNLOAD,
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
            // dirLog(
            //   '-- ERROR processUsedFileDownload - we dont have response. it might be an error',
            //   callResultDownload,
            // );
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
        // const { return: dlReturn, offsetstart: dlOffsetstart, offsetend: dlOffsetend } = responseDownload.result;
        // const responseDownloadFormatted = { dlReturn, dlOffsetstart, dlOffsetend };
        // dirLog('ResponseDownloadFormatted (without downloadedFileData)', responseDownloadFormatted);
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
            const completedProgressPercentage = (Math.round(completedProgress * 100) / 100).toFixed(2);
            const completedProgressMessage = `completed ${readSize} from ${filesize} bytes, or ${completedProgressPercentage}%`;
            // log('3 We have a correct responseDownload', completedProgressMessage);
            const resMsg = `b. we have a correct responseRequestDownload, ${completedProgressMessage} ___${completedProgressPercentage}`;
            progressCb({
                result: {
                    success: true,
                    message: resMsg,
                    code: SdsTypes.DOWNLOAD_CODES.WE_HAVE_CORRECT_RESPONSE_TO_REQUEST_DOWNLOAD,
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
    const callResultGetFileStatus = await network_1.networkApi.sendUserRequestGetFileStatus(extraParamsForGetFileStatus);
    progressCb({
        result: {
            success: true,
            code: types_1.UPLOAD_CODES.GET_FILE_STATUS,
            message: 'call result get file status (end)',
            details: {
                callResultGetFileStatus,
            },
        },
    });
    const { response: responseGetFileStatus } = callResultGetFileStatus;
    if (!responseGetFileStatus) {
        const errorMsg = 'we dont have response for get file status request. it might be an error';
        progressCb({
            result: {
                success: false,
                code: types_1.UPLOAD_CODES.GET_FILE_STATUS_NO_RESPONSE,
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
        const errorMsg = `return field in the file status response has an error. It must be equal to 0. Error code "${requestGetFileStatusReturn}"`;
        progressCb({
            result: { success: false, code: types_1.UPLOAD_CODES.GET_FILE_STATUS_NOT_NUMBER },
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
    const callResult = await network_1.networkApi.sendUserRequestList(extraParams);
    const { response } = callResult;
    if (!response) {
        throw 'Could not fetch a list of files. No response in the call result';
    }
    const userFiles = response.result.fileinfo;
    return {
        originalResponse: callResult.response,
        files: userFiles,
    };
};
exports.getUploadedFileList = getUploadedFileList;
const getAllUploadedFileList = async (keypair) => {
    var _a;
    let currentPage = 0;
    const resultFileList = [];
    let weContinue = true;
    do {
        const userFileList = await (0, exports.getUploadedFileList)(keypair, currentPage);
        const { originalResponse, files } = userFileList;
        const totalNumber = (_a = originalResponse === null || originalResponse === void 0 ? void 0 : originalResponse.result) === null || _a === void 0 ? void 0 : _a.totalnumber;
        console.log('number!!', totalNumber);
        const weHaveDataOnThisPage = !!files && !!totalNumber;
        if (weHaveDataOnThisPage) {
            currentPage += 1;
            resultFileList.push(...files);
        }
        if (resultFileList.length >= totalNumber) {
            weContinue = false;
        }
    } while (weContinue);
    return resultFileList;
};
exports.getAllUploadedFileList = getAllUploadedFileList;
const downloadFileOriginal = async (keypair, filePathToSave, filehash, filesize) => {
    const { address, publicKey } = keypair;
    const sequence = await getCurrentSequenceString(address);
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
    const decodedFile = await processUsedFileDownload(responseRequestDl, filehash, filesize);
    if (!decodedFile) {
        throw new Error(`Could not process download of the user file for the "${filehash}" into "${filePathToSave}"`);
    }
    (0, helpers_1.log)(`Downloaded user file will be saved into ${filePathToSave}`, filePathToSave);
    filesystem_1.filesystemApi.writeFile(filePathToSave, decodedFile);
    return { filePathToSave };
};
exports.downloadFileOriginal = downloadFileOriginal;
const downloadFileToBuffer = async (keypair, filehash, filesize, progressCb = () => { }) => {
    const { address, publicKey } = keypair;
    const sequence = await getCurrentSequenceString(address);
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
        const errorMsg = 'Error. There is no response for download request.';
        // dirLog('-- ERROR - we dont have response for dl request.', callResultRequestDl);
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
        // dirLog('we dont have required fields in the download shared response ', responseRequestDl);
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
        // dirLog('--- ERROR a we dont have an offest. could be an error. response is', responseRequestDl);
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
        // dirLog('--- ERROR b we dont have an offest. could be an error. response is', responseRequestDl);
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
        throw new Error();
    }
    const decodedFile = await processUsedFileDownload(responseRequestDl, filehash, filesize, progressCb);
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
        throw new Error();
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
const getCurrentSequenceString = async (address) => {
    const ozoneBalance = await accounts_1.accountsApi.getOtherBalanceCardMetrics(address);
    const { detailedBalance } = ozoneBalance;
    if (!detailedBalance) {
        throw new Error('no sequence is presented in the ozone balance response');
    }
    const { sequence } = detailedBalance;
    return sequence;
};
const getUserRequestUploadParams = async (keypair, filehash, filename, filesize, sequence) => {
    const { address, publicKey } = keypair;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${filehash}${address}${sequence}${timestamp}`;
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
    const callResultInit = await network_1.networkApi.sendUserRequestUpload(extraParams);
    const { response: responseInit } = callResultInit;
    const errorsList = [];
    if (!responseInit) {
        errorsList.push(`params for sendUserRequestUpload which we had when the error occured. ${JSON.stringify(extraParams)}`);
        errorsList.push('we dont have response. it might be an error.');
        return { responseInit, isContinueInit: 0, callResultInit, errorsList };
    }
    const { result: resultWithOffesets } = responseInit;
    const { offsetend: offsetendInit, offsetstart: offsetstartInit, return: isContinueInit, } = resultWithOffesets;
    return { offsetstartInit, offsetendInit, isContinueInit, responseInit, callResultInit, errorsList };
};
const getUserUploadDataParams = async (keypair, filehash, sequenceUpload, encodedFileChunk, stop = false) => {
    const { address, publicKey } = keypair;
    const timestampForUpload = (0, helpers_1.getTimestampInSeconds)();
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
    const fileInfo = await filesystem_1.filesystemApi.getFileInfo(fileReadPath);
    const readBinaryFile = await filesystem_1.filesystemApi.getFileBuffer(fileReadPath);
    return (0, exports.updloadFileFromBuffer)(keypair, readBinaryFile, imageFileName, fileInfo.filehash, fileInfo.size);
};
exports.updloadFile = updloadFile;
const updloadFileFromBuffer = async (keypair, fileBuffer, resolvedFileName, fileHash, fileSize, progressCb = () => { }) => {
    var _a;
    const { address, publicKey } = keypair;
    const sequenceUpload = await getCurrentSequenceString(address);
    const extraParams = await getUserRequestUploadParams(keypair, fileHash, resolvedFileName, fileSize, sequenceUpload);
    const { errorsList: initErrorsList, responseInit, callResultInit, offsetstartInit, offsetendInit, isContinueInit, } = await getOffsetsAndResultFromRequestUpload(extraParams);
    if (initErrorsList.length) {
        const errorMsg = 'sendUserRequestUpload has returned an error';
        progressCb({
            result: { success: false, code: types_1.UPLOAD_CODES.USER_REQUEST_UPLOAD_ERROR },
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
        const errorMsg = 'looks like the file was already sent. will try to reset its progress';
        progressCb({
            result: { success: false, code: types_1.UPLOAD_CODES.USER_REQUEST_UPLOAD_FILE_ALREADY_SENT },
            error: {
                message: errorMsg,
                details: { isContinueGlobal },
            },
        });
        const extraParamsForUpload = await getUserUploadDataParams(keypair, fileHash, sequenceUpload, '', true);
        const callResultUpload = await network_1.networkApi.sendUserUploadData(extraParamsForUpload);
        const { response: responseUploadToTest } = callResultUpload;
        const resMsg = 'responseUploadToTest after sending the stop to sendUserUploadData';
        progressCb({
            result: { success: true, message: resMsg, code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_REQUEST_SENT },
        });
        try {
            const { result: { return: returnStop }, } = responseUploadToTest;
            if (+returnStop === -14) {
                const resMsg = 'we have stopped the upload succesfully. sending request upload again';
                progressCb({
                    result: {
                        success: true,
                        code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_PROCESS_STOPPED,
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
            const errorMsg = 'we could not stop the upload. Exiting. try agian later';
            progressCb({
                result: { success: false, code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_PROCESS_STOP_FAIL },
                error: {
                    message: errorMsg,
                    details: error,
                },
            });
            throw Error(errorMsg);
        }
    }
    if (offsetEndGlobal === undefined) {
        const errorMsg = 'we dont have an offest end for init. could be an error.';
        progressCb({
            result: { success: false, code: types_1.UPLOAD_CODES.USER_REQUEST_UPLOAD_NO_OFFSET_END },
            error: {
                message: errorMsg,
                details: { offsetEndGlobal, responseInitGlobal },
            },
        });
        throw Error(errorMsg);
    }
    if (offsetStartGlobal === undefined) {
        const errorMsg = 'we dont have an offest start for init. could be an error.';
        progressCb({
            result: { success: false, code: types_1.UPLOAD_CODES.USER_REQUEST_UPLOAD_NO_OFFSET_START },
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
    let uploadReturn = '';
    while (isContinueGlobal === 1) {
        const fileChunk = readBinaryFile.slice(offsetStartGlobal, offsetEndGlobal);
        if (!fileChunk) {
            const errorMsg = 'fileChunk is missing. Exiting';
            progressCb({
                result: { success: false, code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_NO_FILE_CHUNK },
                error: {
                    message: errorMsg,
                    details: { fileChunk },
                },
            });
            throw Error(errorMsg);
        }
        if (fileChunk) {
            const encodedFileChunk = await filesystem_1.filesystemApi.encodeBuffer(fileChunk);
            readSize = readSize + fileChunk.length;
            completedProgress = (100 * readSize) / fileSize;
            const completedPercentage = (Math.round(completedProgress * 100) / 100).toFixed(2);
            const completedProgressMessage = `completed ${readSize} from ${fileSize} bytes, or ${completedPercentage}%`;
            progressCb({
                result: {
                    message: 'we have a correct buffer chunk ' + completedProgressMessage,
                    code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_FILE_CHUNK_CORRECT,
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
                const extraParamsForUpload = await getUserUploadDataParams(keypair, fileHash, encodedFileChunk, sequenceUpload);
                const callResultUpload = await network_1.networkApi.sendUserUploadData(extraParamsForUpload);
                const { response: responseUploadToTest } = callResultUpload;
                if (!responseUploadToTest) {
                    const errorMsg = '-- ERROR 1 we dont have upload response. it might be an error';
                    progressCb({
                        result: { success: false, code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_NO_RESPONSE },
                        error: {
                            message: errorMsg,
                            details: { callResultUpload },
                        },
                    });
                    continue;
                }
                if (!responseUploadToTest.id || !!responseUploadToTest.error) {
                    const errorMsg = `ERROR 2 --- we dont have upload response id or it has an error. ${JSON.stringify(callResultUpload)}`;
                    progressCb({
                        result: { success: false, code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_NO_ID_IN_RESPONSE },
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
                progressCb({
                    result: {
                        success: true,
                        code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_RESPONSE_CORRECT,
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
                const errorMsg = `--- ERROR 3 - we dont have an offest. could be an error. response is:  ${JSON.stringify(responseUpload)}`;
                progressCb({
                    result: {
                        success: false,
                        code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_NO_OFFSET_END,
                        message: errorMsg,
                        details: { offsetendUpload },
                    },
                });
                break;
            }
            if (offsetstartUpload === undefined) {
                const errorMsg = `--- ERROR 4 - we dont have an offest. could be an error. response is:  ${JSON.stringify(responseUpload)}`;
                progressCb({
                    result: { success: false, code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_NO_OFFSET_START },
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
    progressCb({
        result: {
            success: true,
            code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_COMPLETED,
            message: `the latest upload return code / value is: ${uploadReturn}`,
            details: { uploadReturn },
        },
    });
    if (isContinueGlobal !== 0) {
        const errorMsg = `There was an error during the upload. "return" from the request is "${isContinueGlobal}" , Details: (${uploadReturn})`;
        progressCb({
            result: { success: false, code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_NO_CONTINUE },
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
            code: types_1.UPLOAD_CODES.USER_UPLOAD_DATA_FINISHED,
            message: 'upload is finished',
            details: {
                uploadResult,
            },
        },
    });
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
    const callResultRequestShare = await network_1.networkApi.sendUserRequestShare([extraParams]);
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
    const callResultRequestStopShare = await network_1.networkApi.sendUserRequestStopShare([extraParams]);
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
    const callResultRequestListShare = await network_1.networkApi.sendUserRequestListShare([extraParams]);
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
    const { address, publicKey } = keypair;
    const sequence = await getCurrentSequenceString(address);
    const filelink = `sds://${sharelink.trim()}`;
    const timestampA = (0, helpers_1.getTimestampInSeconds)();
    const messageToSignA = `${sharelink}${address}${sequence}${timestampA}`;
    const signatureA = await keyUtils.signWithPrivateKey(messageToSignA, keypair.privateKey);
    const extraParams = {
        signature: {
            address,
            pubkey: publicKey,
            signature: signatureA,
        },
        req_time: timestampA,
        sharelink: filelink,
    };
    const callResultRequestGetShared = await network_1.networkApi.sendUserRequestGetShared([extraParams]);
    const { response: responseRequestGetShared } = callResultRequestGetShared;
    if (!responseRequestGetShared) {
        (0, helpers_1.dirLog)('we dont have response for dl request. it might be an error', callResultRequestGetShared);
        throw new Error('We dont have response to request get shared call');
    }
    const { return: requestGetSharedReturn, reqid: reqidDownloadFile, filehash, filename: originalFileName, offsetstart: offsetstartInit, offsetend: offsetendInit, } = responseRequestGetShared.result;
    if (parseInt(requestGetSharedReturn, 10) < 0) {
        throw new Error(`return field in the request get shared response contains an error. Error code "${requestGetSharedReturn}"`);
    }
    if (parseInt(requestGetSharedReturn, 10) !== 2) {
        throw new Error(`return field in the response to request get shared has an unexpected code "${requestGetSharedReturn}". Expected code was "4"`);
    }
    if (!filehash) {
        (0, helpers_1.dirLog)('we dont have required fields in the response ', responseRequestGetShared);
        throw new Error('required fields "filehash"  are missing in the response');
    }
    if (!reqidDownloadFile) {
        (0, helpers_1.dirLog)('we dont have required fields in the download shared response ', responseRequestGetShared);
        throw new Error('required fields "reqid"  is missing in the response');
    }
    if (offsetendInit === undefined) {
        (0, helpers_1.dirLog)('--- ERROR a we dont have an offest. could be an error. response is', responseRequestGetShared);
        throw new Error('a we dont have an offest. could be an error. response is');
    }
    if (offsetstartInit === undefined) {
        (0, helpers_1.dirLog)('--- ERROR b we dont have an offest. could be an error. response is', responseRequestGetShared);
        throw new Error('b we dont have an offest. could be an error. response is');
    }
    const decodedFile = await processUsedFileDownload(responseRequestGetShared, filehash, filesize);
    if (!decodedFile) {
        throw new Error(`Could not process download of the user shared file for the "${filehash}" into "${filePathToSave}"`);
    }
    const filePathToSaveWithOriginalName = `${filePathToSave}_${originalFileName}`;
    (0, helpers_1.log)(`Downloaded shared file will be saved into ${filePathToSaveWithOriginalName}`, filePathToSaveWithOriginalName);
    filesystem_1.filesystemApi.writeFile(filePathToSaveWithOriginalName, decodedFile);
    return { filePathToSave: filePathToSaveWithOriginalName };
};
exports.downloadSharedFile = downloadSharedFile;
//# sourceMappingURL=remoteFileSystem.js.map