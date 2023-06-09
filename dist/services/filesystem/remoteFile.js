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
exports.downloadSharedFile = exports.getSharedFileList = exports.stopFileSharing = exports.shareFile = exports.updloadFile = exports.downloadFile = exports.getUploadedFileList = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const accounts = __importStar(require("../../accounts"));
const keyUtils = __importStar(require("../../hdVault/keyUtils"));
const FilesystemService = __importStar(require("../../services/filesystem"));
const helpers_1 = require("../../services/helpers");
const Network = __importStar(require("../../services/network"));
const network_1 = require("../network");
const getUploadedFileList = async (address, page = 0) => {
    const extraParams = [
        {
            walletaddr: address,
            page,
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
    var _a;
    const { address, publicKey } = keypair;
    const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);
    const { detailedBalance } = ozoneBalance;
    if (!detailedBalance) {
        throw new Error('no sequence is presented in the ozone balance response');
    }
    const { sequence } = detailedBalance;
    // const filehash = filehashA;
    // const filesize = filesizeA;
    const sdmAddress = address;
    const filehandle = `sdm://${sdmAddress}/${filehash}`;
    (0, helpers_1.log)('filehandle', filehandle);
    const messageToSign = `${filehash}${address}${sequence}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = [
        {
            filehandle,
            walletaddr: address,
            walletpubkey: publicKey,
            signature,
        },
    ];
    const callResultRequestDl = await Network.sendUserRequestDownload(extraParams);
    const { response: responseRequestDl } = callResultRequestDl;
    if (!responseRequestDl) {
        (0, helpers_1.dirLog)('we dont have response for dl request. it might be an error', callResultRequestDl);
        return;
    }
    const { result: resultWithOffesets } = responseRequestDl;
    let offsetStartGlobal = 0;
    let offsetEndGlobal = 0;
    let isContinueGlobal = 0;
    const fileInfoChunks = [];
    const { return: isContinueInit, reqid, offsetstart: offsetstartInit, offsetend: offsetendInit, filedata, } = resultWithOffesets;
    const responseDownloadInitFormatted = { isContinueInit, offsetstartInit, offsetendInit };
    (0, helpers_1.dirLog)('responseDownloadInitFormatted', responseDownloadInitFormatted);
    if (offsetendInit === undefined) {
        (0, helpers_1.dirLog)('a we dont have an offest. could be an error. response is', responseRequestDl);
        return;
    }
    if (offsetstartInit === undefined) {
        (0, helpers_1.dirLog)('b we dont have an offest. could be an error. response is', responseRequestDl);
        return;
    }
    isContinueGlobal = +isContinueInit;
    offsetStartGlobal = +offsetstartInit;
    offsetEndGlobal = +offsetendInit;
    const fileChunk = { offsetstart: offsetStartGlobal, offsetend: offsetEndGlobal, filedata };
    fileInfoChunks.push(fileChunk);
    while (isContinueGlobal === 2) {
        (0, helpers_1.log)('will call download confirmation for ', offsetStartGlobal, offsetEndGlobal);
        const extraParamsForDownload = [
            {
                filehash,
                reqid,
            },
        ];
        const callResultDownload = await Network.sendUserDownloadData(extraParamsForDownload);
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
        const extraParamsForDownload = [
            {
                filehash,
                // filesize,
                reqid,
            },
        ];
        const callResultDownloadFileInfo = await Network.sendUserDownloadedFileInfo(extraParamsForDownload);
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
    (0, helpers_1.log)(`file will be saved into ${filePathToSave}`, filePathToSave);
    FilesystemService.writeFile(filePathToSave, decodedFile);
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
    const messageToSign = `${fileInfo.filehash}${address}${sequence}`;
    const stats = fs_1.default.statSync(fileReadPath);
    const fileSize = stats.size;
    (0, helpers_1.log)('stats', stats);
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParams = [
        {
            filename: imageFileName,
            filesize: fileInfo.size,
            filehash: fileInfo.filehash,
            walletaddr: address,
            walletpubkey: publicKey,
            signature,
        },
    ];
    (0, helpers_1.log)('beginning init call');
    const callResultInit = await Network.sendUserRequestUpload(extraParams);
    const { response: responseInit } = callResultInit;
    (0, helpers_1.log)('call result init (end of init)', JSON.stringify(callResultInit));
    if (!responseInit) {
        (0, helpers_1.log)('we dont have response. it might be an error', callResultInit);
        return;
    }
    const { result: resultWithOffesets } = responseInit;
    (0, helpers_1.log)('result with offesets', resultWithOffesets);
    let offsetStartGlobal = 0;
    let offsetEndGlobal = 0;
    let isContinueGlobal = 0;
    const { offsetend: offsetendInit, offsetstart: offsetstartInit, return: isContinueInit, } = resultWithOffesets;
    if (offsetendInit === undefined) {
        (0, helpers_1.log)('we dont have an offest end for init. could be an error. response is', responseInit);
        return;
    }
    if (offsetstartInit === undefined) {
        (0, helpers_1.log)('we dont have an offest start for init. could be an error. response is', responseInit);
        return;
    }
    let readSize = 0;
    let completedProgress = 0;
    isContinueGlobal = +isContinueInit;
    offsetStartGlobal = +offsetstartInit;
    offsetEndGlobal = +offsetendInit;
    (0, helpers_1.log)('starting to get file buffer');
    const readBinaryFile = await FilesystemService.getFileBuffer(fileReadPath);
    (0, helpers_1.log)('ended  get file buffer');
    while (isContinueGlobal === 1) {
        (0, helpers_1.log)('!!! while start, starting getting a slice');
        const fileChunk = readBinaryFile.slice(offsetStartGlobal, offsetEndGlobal);
        (0, helpers_1.log)('slice is retrieved');
        if (!fileChunk) {
            (0, helpers_1.log)('fileChunk is missing, Exiting ', fileChunk);
            break;
        }
        if (fileChunk) {
            (0, helpers_1.log)('encodeBuffer start');
            const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
            (0, helpers_1.log)('encodeBuffer end');
            readSize = readSize + fileChunk.length;
            completedProgress = (100 * readSize) / fileSize;
            (0, helpers_1.log)(`from run.ts - completed ${readSize} from ${fileSize} bytes, or ${(Math.round(completedProgress * 100) / 100).toFixed(2)}%`);
            // upload
            const extraParamsForUpload = [
                {
                    filehash: fileInfo.filehash,
                    data: encodedFileChunk,
                },
            ];
            (0, helpers_1.log)('will call upload (start)');
            const callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);
            (0, helpers_1.log)('call result upload (end)', JSON.stringify(callResultUpload));
            const { response: responseUpload } = callResultUpload;
            if (!responseUpload) {
                (0, helpers_1.log)('we dont have response. it might be an error', callResultUpload);
                return;
            }
            const { result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload }, } = responseUpload;
            if (offsetendUpload === undefined) {
                (0, helpers_1.log)('1 we dont have an offest. could be an error. response is', responseUpload);
                return;
            }
            if (offsetstartUpload === undefined) {
                (0, helpers_1.log)('2 we dont have an offest. could be an error. response is', responseUpload);
                return;
            }
            isContinueGlobal = +isContinueUpload;
            offsetStartGlobal = +offsetstartUpload;
            offsetEndGlobal = +offsetendUpload;
            (0, helpers_1.log)('while end ___');
        }
    }
    (0, helpers_1.log)(`The latest upload request return code is "${isContinueGlobal}"`);
    if (isContinueGlobal !== 0) {
        const errorMsg = `There was an error during the upload. "return" from the request is "${isContinueGlobal}"`;
        throw new Error(errorMsg);
    }
};
exports.updloadFile = updloadFile;
const shareFile = async (keypair, filehash) => {
    const { address } = keypair;
    const extraParams = {
        filehash,
        walletaddr: address,
        duration: 0,
        bool: false,
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
    const { address } = keypair;
    const extraParams = {
        walletaddr: address,
        shareid,
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
const getSharedFileList = async (address, page = 0) => {
    const extraParams = {
        walletaddr: address,
        page,
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
    var _a;
    (0, helpers_1.log)(filePathToSave);
    const { address, publicKey } = keypair;
    // const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);
    //
    // const { detailedBalance } = ozoneBalance;
    //
    // if (!detailedBalance) {
    //   throw new Error('no sequence is presented in the ozone balance response');
    // }
    //
    // const { sequence } = detailedBalance;
    // log(sequence);
    // const sdmAddress = address;
    // const filehandle = `sdm://${sdmAddress}/${sharelink}`;
    const extraParams = {
        walletaddr: address,
        walletpubkey: publicKey,
        sharelink,
    };
    const callResultRequestGetShared = await Network.sendUserRequestGetShared([extraParams]);
    console.log('callResultRequestGetShared', callResultRequestGetShared);
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
    const messageToSign = `${filehash}${address}${sequencenumber}`;
    const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
    const extraParamsForDownload = {
        filehash,
        walletaddr: address,
        walletpubkey: publicKey,
        signature,
        reqid,
    };
    const callResultRequestDownloadShared = await Network.sendUserRequestDownloadShared([
        extraParamsForDownload,
    ]);
    // console.log('callResultRequestDownloadShared', callResultRequestDownloadShared);
    const { response: responseRequestDownloadShared } = callResultRequestDownloadShared;
    if (!responseRequestDownloadShared) {
        (0, helpers_1.dirLog)('we dont have response for download shared request. it might be an error', callResultRequestDownloadShared);
        throw new Error('We dont have response to request download shared call');
    }
    const { result: resultWithOffesets } = responseRequestDownloadShared;
    let offsetStartGlobal = 0;
    let offsetEndGlobal = 0;
    let isContinueGlobal = 0;
    const fileInfoChunks = [];
    const { return: requestDownloadSharedReturn, reqid: reqidDownloadShared, 
    // return: isContinueInit,
    // reqid,
    offsetstart: offsetstartInit, offsetend: offsetendInit, filedata, } = resultWithOffesets;
    // } = responseRequestDownloadShared.result;
    console.log('aaa rrr', responseRequestDownloadShared.result);
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
    isContinueGlobal = +requestDownloadSharedReturn;
    // isContinueGlobal = +isContinueInit;
    offsetStartGlobal = +offsetstartInit;
    offsetEndGlobal = +offsetendInit;
    const fileChunk = { offsetstart: offsetStartGlobal, offsetend: offsetEndGlobal, filedata };
    fileInfoChunks.push(fileChunk);
    while (isContinueGlobal === 2) {
        (0, helpers_1.log)('will call download confirmation for ', offsetStartGlobal, offsetEndGlobal);
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
        const extraParamsForDownload = [
            {
                filehash,
                // filesize,
                reqid,
            },
        ];
        const callResultDownloadFileInfo = await Network.sendUserDownloadedFileInfo(extraParamsForDownload);
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
    (0, helpers_1.log)(`file will be saved into ${filePathToSave}`, filePathToSave);
    FilesystemService.writeFile(filePathToSave, decodedFile);
    // const { result: resultWithOffesets } = responseRequestDl;
    //
    // const messageToSign = `${sharelink}${address}${sequence}`;
    //
    // const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
};
exports.downloadSharedFile = downloadSharedFile;
//# sourceMappingURL=remoteFile.js.map