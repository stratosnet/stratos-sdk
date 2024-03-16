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
exports.downloadSharedFile = exports.getSharedFileList = exports.stopFileSharing = exports.shareFile = exports.updloadFile = exports.downloadFile = exports.getUploadedFileList = exports.getUploadedFilesStatus = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const accounts = __importStar(require("../accounts"));
const remotefs_1 = require("../config/remotefs");
const keyUtils = __importStar(require("../hdVault/keyUtils"));
const FilesystemService = __importStar(require("../services/filesystem"));
const helpers_1 = require("../services/helpers");
const Network = __importStar(require("../services/network"));
const network_1 = require("../services/network");
const processUsedFileDownload = async (responseRequestDownloadShared, filehash) => {
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
    while (isContinueGlobal === 2) {
        // log('will call download confirmation for ', offsetStartGlobal, offsetEndGlobal);
        const extraParamsForUserDownload = [
            {
                filehash,
                reqid: reqidDownloadShared,
            },
        ];
        const callResultDownload = await Network.sendUserDownloadData(extraParamsForUserDownload);
        const { response: responseDownload } = callResultDownload;
        if (!responseDownload) {
            (0, helpers_1.dirLog)('we dont have response. it might be an error', callResultDownload);
            return;
        }
        const { return: dlReturn, offsetstart: dlOffsetstart, offsetend: dlOffsetend } = responseDownload.result;
        const responseDownloadFormatted = { dlReturn, dlOffsetstart, dlOffsetend };
        (0, helpers_1.dirLog)('responseDownloadFormatted', responseDownloadFormatted);
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
        (0, helpers_1.dirLog)('call result download', callResultDownloadFileInfo);
        const { response: responseDownloadFileInfo } = callResultDownloadFileInfo;
        downloadConfirmed = ((_a = responseDownloadFileInfo === null || responseDownloadFileInfo === void 0 ? void 0 : responseDownloadFileInfo.result) === null || _a === void 0 ? void 0 : _a.return) || '-1';
        (0, helpers_1.log)('responseDownloadFileInfo', responseDownloadFileInfo);
    }
    if (+downloadConfirmed !== 0) {
        throw new Error('could not get download confirmation');
    }
    const sortedFileInfoChunks = fileInfoChunks.sort((a, b) => {
        const res = a.offsetstart - b.offsetstart;
        return res;
    });
    (0, helpers_1.log)('sortedFileInfoChunks.length ', sortedFileInfoChunks.length);
    const encodedFileChunks = sortedFileInfoChunks
        .map(fileInfoChunk => {
        (0, helpers_1.log)('offsetstart, offsetend', fileInfoChunk.offsetstart, fileInfoChunk.offsetend);
        return fileInfoChunk.filedata || '';
    })
        .filter(Boolean);
    (0, helpers_1.log)('encodedFileChunks', encodedFileChunks.length);
    const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);
    const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
    return decodedFile;
};
const getUploadedFilesStatus = async (keypair, fileHash) => {
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
    (0, helpers_1.log)('call result get file status (end)', JSON.stringify(callResultGetFileStatus));
    const { response: responseGetFileStatus } = callResultGetFileStatus;
    if (!responseGetFileStatus) {
        (0, helpers_1.dirLog)('we dont have response for get file status request. it might be an error', callResultGetFileStatus);
        throw new Error('We dont have response to get file status request call');
    }
    const { result: updloadedFileStatusResult } = responseGetFileStatus;
    const { return: requestGetFileStatusReturn, file_upload_state: fileUploadState, user_has_file: userHasFile, replicas, } = updloadedFileStatusResult;
    if (parseInt(requestGetFileStatusReturn, 10) !== 0) {
        throw new Error(`return field in the request get file status response contains an error. Error code "${requestGetFileStatusReturn}"`);
    }
    const fileStatusInfo = {
        fileHash,
        fileUploadState,
        userHasFile,
        replicas,
        requestGetFileStatusReturn,
    };
    return fileStatusInfo;
    // updloadedFileStateGlobal = fileUploadState;
    // log(`current file state ${updloadedFileStateGlobal}`, typeof updloadedFileStateGlobal);
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
const downloadFile = async (keypair, filePathToSave, filehash) => {
    const { address, publicKey } = keypair;
    const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);
    const { detailedBalance } = ozoneBalance;
    if (!detailedBalance) {
        throw new Error('no sequence is presented in the ozone balance response');
    }
    const { sequence } = detailedBalance;
    const sdmAddress = address;
    const filehandle = `sdm://${sdmAddress}/${filehash}`;
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
        (0, helpers_1.dirLog)('we dont have response for dl request. it might be an error', callResultRequestDl);
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
        (0, helpers_1.dirLog)('a we dont have an offest. could be an error. response is', responseRequestDl);
        throw new Error('a we dont have an offest. could be an error. response is');
    }
    if (offsetstartInit === undefined) {
        (0, helpers_1.dirLog)('b we dont have an offest. could be an error. response is', responseRequestDl);
        throw new Error('b we dont have an offest. could be an error. response is');
    }
    const decodedFile = await processUsedFileDownload(responseRequestDl, filehash);
    if (!decodedFile) {
        throw new Error(`Could not process download of the user file for the "${filehash}" into "${filePathToSave}"`);
    }
    (0, helpers_1.log)(`downloaded user file will be saved into ${filePathToSave}`, filePathToSave);
    FilesystemService.writeFile(filePathToSave, decodedFile);
    return { filePathToSave };
};
exports.downloadFile = downloadFile;
const updloadFile = async (keypair, fileReadPath) => {
    const imageFileName = path_1.default.basename(fileReadPath);
    const fileInfo = await FilesystemService.getFileInfo(fileReadPath);
    const { address, publicKey } = keypair;
    const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);
    const { detailedBalance } = ozoneBalance;
    if (!detailedBalance) {
        throw new Error('no sequence is presented in the ozone balance response');
    }
    const { sequence } = detailedBalance;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${fileInfo.filehash}${address}${sequence}${timestamp}`;
    const stats = fs_1.default.statSync(fileReadPath);
    const fileSize = stats.size;
    (0, helpers_1.log)('stats', stats);
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = [
        {
            filename: imageFileName,
            filesize: fileInfo.size,
            filehash: fileInfo.filehash,
            signature: {
                address,
                pubkey: publicKey,
                signature,
            },
            req_time: timestamp,
        },
    ];
    // log('beginning init call');
    const callResultInit = await Network.sendUserRequestUpload(extraParams);
    const { response: responseInit } = callResultInit;
    (0, helpers_1.log)('call result init (end of init)', JSON.stringify(callResultInit));
    if (!responseInit) {
        (0, helpers_1.log)('params for sendUserRequestUpload which we had when the error occured', extraParams);
        (0, helpers_1.log)('we dont have response. it might be an error', callResultInit);
        throw new Error('we dont have response. it might be an error');
    }
    const { result: resultWithOffesets } = responseInit;
    (0, helpers_1.log)('result with offesets', resultWithOffesets);
    let offsetStartGlobal = 0;
    let offsetEndGlobal = 0;
    let isContinueGlobal = 0;
    const { offsetend: offsetendInit, offsetstart: offsetstartInit, return: isContinueInit, } = resultWithOffesets;
    if (offsetendInit === undefined) {
        (0, helpers_1.log)('we dont have an offest end for init. could be an error. response is', responseInit);
        throw new Error('we dont have an offest end for init. could be an error.');
    }
    if (offsetstartInit === undefined) {
        (0, helpers_1.log)('we dont have an offest start for init. could be an error. response is', responseInit);
        throw new Error('we dont have an offest start for init. could be an error.');
    }
    let readSize = 0;
    let completedProgress = 0;
    isContinueGlobal = +isContinueInit;
    offsetStartGlobal = +offsetstartInit;
    offsetEndGlobal = +offsetendInit;
    // log('starting to get file buffer');
    const readBinaryFile = await FilesystemService.getFileBuffer(fileReadPath);
    // log('ended  get file buffer');
    let uploadReturn = '';
    while (isContinueGlobal === 1) {
        // log('!!! while start, starting getting a slice');
        const fileChunk = readBinaryFile.slice(offsetStartGlobal, offsetEndGlobal);
        // log('slice is retrieved');
        if (!fileChunk) {
            (0, helpers_1.log)('fileChunk is missing, Exiting ', fileChunk);
            throw new Error('fileChunk is missing. Exiting');
        }
        if (fileChunk) {
            // log('encodeBuffer start');
            const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
            // log('encodeBuffer end');
            readSize = readSize + fileChunk.length;
            completedProgress = (100 * readSize) / fileSize;
            (0, helpers_1.log)(`from run.ts - completed ${readSize} from ${fileSize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(2)}%`);
            const timestampForUpload = (0, helpers_1.getTimestampInSeconds)();
            const messageToSignForUpload = `${fileInfo.filehash}${address}${sequence}${timestampForUpload}`;
            const signatureForUpload = await keyUtils.signWithPrivateKey(messageToSignForUpload, keypair.privateKey);
            // upload
            const extraParamsForUpload = [
                {
                    filehash: fileInfo.filehash,
                    data: encodedFileChunk,
                    signature: {
                        address,
                        pubkey: publicKey,
                        signature: signatureForUpload,
                    },
                    req_time: timestampForUpload,
                },
            ];
            const callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);
            (0, helpers_1.log)('call result upload (end)', JSON.stringify(callResultUpload));
            const { response: responseUpload } = callResultUpload;
            if (!responseUpload) {
                (0, helpers_1.log)('params to be sent to sendUserUploadData we had when the error occured', extraParamsForUpload);
                (0, helpers_1.log)('we dont have upload response. it might be an error', callResultUpload);
                throw new Error('we dont have upload response. it might be an error');
            }
            if (!responseUpload.id || !!responseUpload.error) {
                (0, helpers_1.log)('params to be sent to sendUserUploadData we had when the error occured', extraParamsForUpload);
                (0, helpers_1.log)('we dont have upload response id or response has an error. it might be an error', callResultUpload);
                throw new Error('we dont have upload response or it has an error. it might be an error');
            }
            const { result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload }, } = responseUpload;
            uploadReturn = isContinueUpload;
            isContinueGlobal = +isContinueUpload;
            if (offsetendUpload === undefined) {
                (0, helpers_1.log)('1 we dont have an offest. could be an error. response is', responseUpload);
                break;
                // throw new Error('1 we dont have an offest. could be an error. response is');
            }
            if (offsetstartUpload === undefined) {
                (0, helpers_1.log)('2 we dont have an offest. could be an error. response is', responseUpload);
                break;
                // throw new Error('2 we dont have an offest. could be an error. response is');
            }
            offsetStartGlobal = +offsetstartUpload;
            offsetEndGlobal = +offsetendUpload;
            // log('while end ___');
        }
    }
    (0, helpers_1.log)(`The latest upload request return code / value is "${uploadReturn}"`);
    if (isContinueGlobal !== 0) {
        (0, helpers_1.log)('oh no!!! isContinueGlobal', isContinueGlobal);
        const errorMsg = `There was an error during the upload. "return" from the request is "${isContinueGlobal}"`;
        throw new Error(errorMsg);
    }
    let updloadedFileStateGlobal = 2; // failed
    let fileStatusInfoGlobal;
    let attemptsCount = 0;
    do {
        attemptsCount += 1;
        const fileStatusInfo = await (0, exports.getUploadedFilesStatus)(keypair, fileInfo.filehash);
        const { fileUploadState } = fileStatusInfo;
        fileStatusInfoGlobal = fileStatusInfo;
        updloadedFileStateGlobal = fileUploadState;
        await (0, helpers_1.delay)(remotefs_1.FILE_STATUS_CHECK_WAIT_TIME);
    } while (attemptsCount <= remotefs_1.FILE_STATUS_CHECK_MAX_ATTEMPTS && updloadedFileStateGlobal !== 3);
    const uploadResult = {
        uploadReturn,
        filehash: fileInfo.filehash,
        fileStatusInfo: fileStatusInfoGlobal,
    };
    return uploadResult;
};
exports.updloadFile = updloadFile;
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
const downloadSharedFile = async (keypair, filePathToSave, sharelink) => {
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
    const decodedFile = await processUsedFileDownload(responseRequestDownloadShared, filehash);
    if (!decodedFile) {
        throw new Error(`Could not process download of the user shared file for the "${filehash}" into "${filePathToSave}"`);
    }
    (0, helpers_1.log)(`downloaded shared file will be saved into ${filePathToSave}`, filePathToSave);
    FilesystemService.writeFile(filePathToSave, decodedFile);
};
exports.downloadSharedFile = downloadSharedFile;
//# sourceMappingURL=remoteFile.js.map