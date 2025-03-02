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
exports.getSharedFileInfo = exports.downloadSharedFile = exports.downloadSharedFileToBuffer = exports.getAllSharedFileList = exports.getSharedFileList = exports.stopFileSharing = exports.shareFile = void 0;
const keyUtils = __importStar(require("../../crypto/hdVault/keyUtils"));
const filesystem_1 = require("../../filesystem");
const network_1 = require("../../network");
const helpers_1 = require("../../services/helpers");
const remoteCommon_1 = require("./remoteCommon");
const remoteDownload_1 = require("./remoteDownload");
const SdsTypes = __importStar(require("./types"));
const shareFile = async (keypair, filehash, durationInDays = 180) => {
    const { address, publicKey } = keypair;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${filehash}${address}${timestamp}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const durationInSec = durationInDays *
        24 * // in hours
        60 * // in minutes
        60; // in seconds
    const extraParams = {
        filehash,
        duration: durationInSec,
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
const getAllSharedFileList = async (keypair) => {
    let currentPage = 0;
    const resultFileList = [];
    let weContinue = true;
    do {
        const userSharedFileList = await (0, exports.getSharedFileList)(keypair, currentPage);
        const { totalnumber: totalNumber, files } = userSharedFileList;
        const weHaveDataOnThisPage = !!files && !!totalNumber;
        if (weHaveDataOnThisPage) {
            currentPage += 1;
            resultFileList.push(...files);
        }
        if (resultFileList.length >= totalNumber) {
            weContinue = false;
        }
        if (totalNumber === undefined) {
            weContinue = false;
        }
    } while (weContinue);
    return resultFileList.sort((a, b) => b.createtime - a.createtime);
};
exports.getAllSharedFileList = getAllSharedFileList;
// 5s - no changes needed
const downloadSharedFileToBuffer = async (keypair, sharelink, // with or without sds://
filesize, progressCb = () => { }) => {
    const { address, publicKey } = keypair;
    const sequence = await (0, remoteCommon_1.getCurrentSequenceString)(address);
    const filelink = sharelink.startsWith('sds://') ? sharelink.trim() : `sds://${sharelink.trim()}`;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${filelink.substring(6)}${address}${sequence}${timestamp}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = {
        signature: {
            address,
            pubkey: publicKey,
            signature,
        },
        req_time: timestamp,
        sharelink: filelink,
    };
    const callResultRequestGetShared = await network_1.networkApi.sendUserRequestGetShared([extraParams]);
    const { response: responseRequestGetShared } = callResultRequestGetShared;
    if (!responseRequestGetShared) {
        const errorMsg = 'Error. There is no response for download shared file request.';
        progressCb({
            result: { success: false, code: SdsTypes.DOWNLOAD_CODES.NO_RESPONSE_TO_DOWNLOAD_REQUEST },
            error: {
                message: errorMsg,
                details: { callResultRequestDl: callResultRequestGetShared },
            },
        });
        throw new Error(errorMsg);
    }
    const { result: resultWithOffesets } = responseRequestGetShared;
    const { return: requestGetSharedReturn, reqid: reqidDownloadFile, filehash, filename: originalFileName, offsetstart: offsetstartInit, offsetend: offsetendInit, } = resultWithOffesets;
    if (parseInt(requestGetSharedReturn, 10) < 0) {
        const errorMsg = `return field in the request get shared response contains an error. Error code "${requestGetSharedReturn}"`;
        progressCb({
            result: { success: false, code: SdsTypes.DOWNLOAD_CODES.RETURN_FIELD_OF_REQUEST_DOWNLOAD_HAS_ERROR },
            error: {
                message: errorMsg,
                details: { responseRequestDl: responseRequestGetShared },
            },
        });
        throw new Error(errorMsg);
    }
    if (parseInt(requestGetSharedReturn, 10) !== 2) {
        const errorMsg = `return field in the response to request get shared has an unexpected code "${requestGetSharedReturn}". Expected code was "4"`;
        progressCb({
            result: {
                success: false,
                code: SdsTypes.DOWNLOAD_CODES.UNEXPECTED_CODE_IN_RETURN_FIELD_OF_REQUEST_DOWNLOAD,
            },
            error: {
                message: errorMsg,
                details: { responseRequestDl: responseRequestGetShared },
            },
        });
        throw new Error(errorMsg);
    }
    if (!filehash) {
        const errorMsg = 'required fields "filehash"  are missing in the response';
        progressCb({
            result: {
                success: false,
                code: SdsTypes.DOWNLOAD_CODES.REQUIRED_REQID_IS_MISSING_IN_THE_RESPONSE,
            },
            error: {
                message: errorMsg,
                details: { responseRequestDl: responseRequestGetShared },
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
                details: { responseRequestDl: responseRequestGetShared },
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
                details: { responseRequestDl: responseRequestGetShared },
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
                details: { responseRequestDl: responseRequestGetShared },
            },
        });
        throw new Error(errorMsg);
    }
    const decodedFile = await (0, remoteDownload_1.processUsedFileDownload)(responseRequestGetShared, filehash, filesize, progressCb);
    if (!decodedFile) {
        const errorMsg = `Could not process download of the user shared file for the "${filehash}" into buffer`;
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
    return { downloadedFile: decodedFile, originalFileName };
};
exports.downloadSharedFileToBuffer = downloadSharedFileToBuffer;
const downloadSharedFile = async (keypair, filePathToSave, sharelink, // with or without sds://
filesize, progressCb = (data) => {
    console.log('data passed to callback', data);
}) => {
    const { downloadedFile, originalFileName } = await (0, exports.downloadSharedFileToBuffer)(keypair, sharelink, filesize, progressCb);
    if (!downloadedFile) {
        throw new Error(`Could not process download of the user shared file for the "${sharelink}" into "${filePathToSave}"`);
    }
    const filePathToSaveWithOriginalName = `${filePathToSave}_${originalFileName}`;
    (0, helpers_1.log)(`Downloaded shared file will be saved into ${filePathToSaveWithOriginalName}`, filePathToSaveWithOriginalName);
    filesystem_1.filesystemApi.writeFile(filePathToSaveWithOriginalName, downloadedFile);
    return { filePathToSave: filePathToSaveWithOriginalName };
};
exports.downloadSharedFile = downloadSharedFile;
// 6s - no changes needed
const getSharedFileInfo = async (keypair, sharelink) => {
    const { address, publicKey } = keypair;
    const sequence = await (0, remoteCommon_1.getCurrentSequenceString)(address);
    const filelink = sharelink.startsWith('sds://') ? sharelink.trim() : `sds://${sharelink.trim()}`;
    const timestamp = (0, helpers_1.getTimestampInSeconds)();
    const messageToSign = `${filelink.substring(6)}${address}${sequence}${timestamp}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = {
        signature: {
            address,
            pubkey: publicKey,
            signature,
        },
        req_time: timestamp,
        sharelink: filelink,
    };
    const callResultRequestGetShared = await network_1.networkApi.sendUserRequestGetShared([extraParams]);
    const { response: responseRequestGetShared } = callResultRequestGetShared;
    if (!responseRequestGetShared) {
        const errorMsg = 'Error. There is no response for download shared file request.';
        throw new Error(errorMsg);
    }
    const { result: resultWithOffesets } = responseRequestGetShared;
    const { return: requestGetSharedReturn, detail, filehash, filename: originalFileName, filesize, } = resultWithOffesets;
    return {
        filehash,
        originalFileName,
        requestGetSharedReturn,
        requestReturnDetail: detail || '',
        filesize,
    };
};
exports.getSharedFileInfo = getSharedFileInfo;
//# sourceMappingURL=remoteShared.js.map