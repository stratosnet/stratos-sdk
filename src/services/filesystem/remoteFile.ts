import fs from 'fs';
import path from 'path';
import * as accounts from '../../accounts';
import { wallet } from '../../hdVault';
import * as keyUtils from '../../hdVault/keyUtils';
import * as FilesystemService from '../../services/filesystem';
import { log, dirLog } from '../../services/helpers';
import * as Network from '../../services/network';
import * as NetworkTypes from '../../services/network/types';
import { networkTypes, sendUserRequestList } from '../network';
import { FileInfoItem } from '../network/types';

type RequestUserFilesResponse = networkTypes.FileUserRequestResult<networkTypes.FileUserRequestListResponse>;

interface UserFileListResponse {
  files: FileInfoItem[];
  originalResponse: RequestUserFilesResponse;
}

const processUsedFileDownload = async <T extends NetworkTypes.FileUserRequestDownloadResponse>(
  responseRequestDownloadShared: T,
  filehash: string,
): Promise<Buffer | undefined> => {
  const { result: resultWithOffesets } = responseRequestDownloadShared;

  let offsetStartGlobal = 0;
  let offsetEndGlobal = 0;
  let isContinueGlobal = 0;

  const fileInfoChunks = [];

  const {
    return: requestDownloadSharedReturn,
    reqid: reqidDownloadShared,
    offsetstart: offsetstartInit,
    offsetend: offsetendInit,
    filedata,
  } = resultWithOffesets;

  isContinueGlobal = +requestDownloadSharedReturn;
  offsetStartGlobal = +offsetstartInit;
  offsetEndGlobal = +offsetendInit;

  const fileChunk = { offsetstart: offsetStartGlobal, offsetend: offsetEndGlobal, filedata };

  fileInfoChunks.push(fileChunk);

  while (isContinueGlobal === 2) {
    log('will call download confirmation for ', offsetStartGlobal, offsetEndGlobal);

    const extraParamsForUserDownload = [
      {
        filehash,
        reqid: reqidDownloadShared,
      },
    ];

    const callResultDownload = await Network.sendUserDownloadData(extraParamsForUserDownload);

    const { response: responseDownload } = callResultDownload;

    if (!responseDownload) {
      dirLog('we dont have response. it might be an error', callResultDownload);

      return;
    }

    const { return: dlReturn, offsetstart: dlOffsetstart, offsetend: dlOffsetend } = responseDownload.result;
    const responseDownloadFormatted = { dlReturn, dlOffsetstart, dlOffsetend };
    dirLog('responseDownloadFormatted', responseDownloadFormatted);

    const {
      result: {
        offsetend: offsetendDownload,
        offsetstart: offsetstartDownload,
        return: isContinueDownload,
        filedata: downloadedFileData,
      },
    } = responseDownload;

    isContinueGlobal = +isContinueDownload;

    if (offsetstartDownload !== undefined && offsetendDownload !== undefined) {
      offsetStartGlobal = +offsetstartDownload;
      offsetEndGlobal = +offsetendDownload;

      const fileChunkDl = {
        offsetstart: offsetStartGlobal,
        offsetend: offsetEndGlobal,
        filedata: downloadedFileData,
      };

      fileInfoChunks.push({ ...fileChunkDl });
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

    dirLog('call result download', callResultDownloadFileInfo);

    const { response: responseDownloadFileInfo } = callResultDownloadFileInfo;

    downloadConfirmed = responseDownloadFileInfo?.result?.return || '-1';

    log('responseDownloadFileInfo', responseDownloadFileInfo);
  }

  if (+downloadConfirmed !== 0) {
    throw new Error('could not get download confirmation');
  }

  const sortedFileInfoChunks = fileInfoChunks.sort((a, b) => {
    const res = a.offsetstart - b.offsetstart;
    return res;
  });

  log('sortedFileInfoChunks.length ', sortedFileInfoChunks.length);

  const encodedFileChunks = sortedFileInfoChunks
    .map(fileInfoChunk => {
      log('offsetstart, offsetend', fileInfoChunk.offsetstart, fileInfoChunk.offsetend);
      return fileInfoChunk.filedata || '';
    })
    .filter(Boolean);

  log('encodedFileChunks', encodedFileChunks.length);

  const decodedChunksList = await FilesystemService.decodeFileChunks(encodedFileChunks);

  const decodedFile = FilesystemService.combineDecodedChunks(decodedChunksList);
  return decodedFile;
};

export const getUploadedFileList = async (address: string, page = 0): Promise<UserFileListResponse> => {
  const extraParams = [
    {
      walletaddr: address,
      page,
    },
  ];

  const callResult = await sendUserRequestList(extraParams);

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

export const downloadFile = async (
  keypair: wallet.KeyPairInfo,
  filePathToSave: string,
  filehash: string,
): Promise<{ filePathToSave: string }> => {
  const { address, publicKey } = keypair;

  const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);

  const { detailedBalance } = ozoneBalance;

  if (!detailedBalance) {
    throw new Error('no sequence is presented in the ozone balance response');
  }

  const { sequence } = detailedBalance;

  const sdmAddress = address;
  const filehandle = `sdm://${sdmAddress}/${filehash}`;

  // log('filehandle', filehandle);

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
    dirLog('we dont have response for dl request. it might be an error', callResultRequestDl);
    throw new Error('we dont have response for dl request. it might be an error');
  }

  const { result: resultWithOffesets } = responseRequestDl;

  const {
    return: requestDownloadFileReturn,
    reqid: reqidDownloadFile,
    offsetstart: offsetstartInit,
    offsetend: offsetendInit,
  } = resultWithOffesets;

  if (parseInt(requestDownloadFileReturn, 10) < 0) {
    throw new Error(
      `return field in the request download shared response contains an error. Error code "${requestDownloadFileReturn}"`,
    );
  }

  if (parseInt(requestDownloadFileReturn, 10) !== 2) {
    throw new Error(
      `return field in the response to request download shared has an unexpected code "${requestDownloadFileReturn}". Expected code was "4"`,
    );
  }

  if (!reqidDownloadFile) {
    dirLog('we dont have required fields in the download shared response ', responseRequestDl);
    throw new Error('required fields "reqid"  is missing in the response');
  }

  if (offsetendInit === undefined) {
    dirLog('a we dont have an offest. could be an error. response is', responseRequestDl);
    throw new Error('a we dont have an offest. could be an error. response is');
  }

  if (offsetstartInit === undefined) {
    dirLog('b we dont have an offest. could be an error. response is', responseRequestDl);
    throw new Error('b we dont have an offest. could be an error. response is');
  }

  const decodedFile = await processUsedFileDownload<NetworkTypes.FileUserRequestDownloadResponse>(
    responseRequestDl,
    filehash,
  );

  if (!decodedFile) {
    throw new Error(
      `Could not process download of the user file for the "${filehash}" into "${filePathToSave}"`,
    );
  }

  log(`downloaded user file will be saved into ${filePathToSave}`, filePathToSave);

  FilesystemService.writeFile(filePathToSave, decodedFile);

  return { filePathToSave };
};

export const updloadFile = async (
  keypair: wallet.KeyPairInfo,
  fileReadPath: string,
): Promise<{ uploadReturn: string; filehash: string }> => {
  const imageFileName = path.basename(fileReadPath);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

  const { address, publicKey } = keypair;

  const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);

  const { detailedBalance } = ozoneBalance;

  if (!detailedBalance) {
    throw new Error('no sequence is presented in the ozone balance response');
  }

  const { sequence } = detailedBalance;

  const messageToSign = `${fileInfo.filehash}${address}${sequence}`;

  const stats = fs.statSync(fileReadPath);
  const fileSize = stats.size;
  log('stats', stats);

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

  // log('beginning init call');
  const callResultInit = await Network.sendUserRequestUpload(extraParams);

  const { response: responseInit } = callResultInit;

  log('call result init (end of init)', JSON.stringify(callResultInit));

  if (!responseInit) {
    log('we dont have response. it might be an error', callResultInit);
    throw new Error('we dont have response. it might be an error');
  }

  const { result: resultWithOffesets } = responseInit;

  log('result with offesets', resultWithOffesets);

  let offsetStartGlobal = 0;
  let offsetEndGlobal = 0;
  let isContinueGlobal = 0;

  const {
    offsetend: offsetendInit,
    offsetstart: offsetstartInit,
    return: isContinueInit,
  } = resultWithOffesets;

  if (offsetendInit === undefined) {
    log('we dont have an offest end for init. could be an error. response is', responseInit);
    throw new Error('we dont have an offest end for init. could be an error.');
  }

  if (offsetstartInit === undefined) {
    log('we dont have an offest start for init. could be an error. response is', responseInit);
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
      log('fileChunk is missing, Exiting ', fileChunk);
      throw new Error('fileChunk is missing. Exiting');
    }

    if (fileChunk) {
      // log('encodeBuffer start');
      const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
      // log('encodeBuffer end');

      readSize = readSize + fileChunk.length;

      completedProgress = (100 * readSize) / fileSize;

      log(
        `from run.ts - completed ${readSize} from ${fileSize} bytes, or ${(
          Math.round(completedProgress * 100) / 100
        ).toFixed(2)}%`,
      );

      // upload
      const extraParamsForUpload = [
        {
          filehash: fileInfo.filehash,
          data: encodedFileChunk,
        },
      ];

      log('will call upload (start)');
      const callResultUpload = await Network.sendUserUploadData(extraParamsForUpload);
      log('call result upload (end)', JSON.stringify(callResultUpload));

      const { response: responseUpload } = callResultUpload;

      if (!responseUpload) {
        log('we dont have upload response. it might be an error', callResultUpload);
        throw new Error('we dont have upload response. it might be an error');
      }

      const {
        result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload },
      } = responseUpload;
      uploadReturn = isContinueUpload;

      isContinueGlobal = +isContinueUpload;

      if (offsetendUpload === undefined) {
        log('1 we dont have an offest. could be an error. response is', responseUpload);
        break;
        // throw new Error('1 we dont have an offest. could be an error. response is');
      }

      if (offsetstartUpload === undefined) {
        log('2 we dont have an offest. could be an error. response is', responseUpload);
        break;
        // throw new Error('2 we dont have an offest. could be an error. response is');
      }

      offsetStartGlobal = +offsetstartUpload;
      offsetEndGlobal = +offsetendUpload;
      // log('while end ___');
    }
  }

  log(`The latest upload request return code / value is "${uploadReturn}"`);

  if (isContinueGlobal !== 0) {
    const errorMsg = `There was an error during the upload. "return" from the request is "${isContinueGlobal}"`;
    throw new Error(errorMsg);
  }

  return { uploadReturn, filehash: fileInfo.filehash };
};

export const shareFile = async (
  keypair: wallet.KeyPairInfo,
  filehash: string,
): Promise<{ filehash: string; sharelink: string; shareid: string }> => {
  const { address } = keypair;

  const extraParams: NetworkTypes.FileUserRequestShareParams = {
    filehash,
    walletaddr: address,
    duration: 0,
    bool: false,
  };

  const callResultRequestShare = await Network.sendUserRequestShare([extraParams]);

  const { response: responseRequestShare } = callResultRequestShare;

  if (!responseRequestShare) {
    dirLog('we dont have response for start share request. it might be an error', callResultRequestShare);

    throw 'Could not start sharing the file. No response in the call result';
  }

  const userStartShareResult = responseRequestShare.result;

  const { return: requestReturn, shareid, sharelink } = userStartShareResult;

  if (parseInt(requestReturn, 10) < 0) {
    throw new Error(`return field in the response contains an error. Error code "${requestReturn}"`);
  }

  if (parseInt(requestReturn, 10) !== 0) {
    throw new Error(
      `return field in the response contains an unexpected code "${requestReturn}". Expected code was "0"`,
    );
  }

  if (!sharelink || !shareid) {
    dirLog('Error: No required fields are presented in the response.', userStartShareResult);
    throw new Error(
      `Could not share file with hash "${filehash}". No required "shareid" and "sharelink" in the response`,
    );
  }

  return {
    filehash,
    sharelink,
    shareid,
  };
};

export const stopFileSharing = async (keypair: wallet.KeyPairInfo, shareid: string): Promise<boolean> => {
  const { address } = keypair;

  const extraParams: NetworkTypes.FileUserRequestStopShareParams = {
    walletaddr: address,
    shareid,
  };

  const callResultRequestStopShare = await Network.sendUserRequestStopShare([extraParams]);

  const { response: responseRequestStopShare } = callResultRequestStopShare;

  if (!responseRequestStopShare) {
    dirLog('we dont have response for stop share request. it might be an error', callResultRequestStopShare);

    throw 'Could not stop sharing the file. No response in the call result';
  }

  const userStopShareResult = responseRequestStopShare.result;

  const { return: requestReturn } = userStopShareResult;

  if (parseInt(requestReturn, 10) < 0) {
    throw new Error(`return field in the response contains an error. Error code "${requestReturn}"`);
  }

  if (parseInt(requestReturn, 10) !== 0) {
    throw new Error(
      `return field in the response contains an unexpected code "${requestReturn}". Expected code was "0"`,
    );
  }

  return true;
};

export const getSharedFileList = async (
  address: string,
  page = 0,
): Promise<{ files: Network.networkTypes.SharedFileInfoItem[]; totalnumber: number }> => {
  const extraParams: NetworkTypes.FileUserRequestListShareParams = {
    walletaddr: address,
    page,
  };

  const callResultRequestListShare = await Network.sendUserRequestListShare([extraParams]);

  const { response: responseRequestListShare } = callResultRequestListShare;

  if (!responseRequestListShare) {
    dirLog('we dont have response for list share request. it might be an error', callResultRequestListShare);

    throw new Error('Could not fetch a list of shared files. No response in the call result');
  }

  const userSharedFiles = responseRequestListShare.result;

  const { totalnumber, fileinfo, return: requestReturn } = userSharedFiles;

  if (parseInt(requestReturn, 10) < 0) {
    throw new Error(`return field in the response contains an error. Error code "${requestReturn}"`);
  }

  if (parseInt(requestReturn, 10) !== 0) {
    throw new Error(
      `return field in the response contains an unexpected code "${requestReturn}". Expected code was "0"`,
    );
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

export const downloadSharedFile = async (
  keypair: wallet.KeyPairInfo,
  filePathToSave: string,
  sharelink: string,
): Promise<void> => {
  log(filePathToSave);
  const { address, publicKey } = keypair;

  const extraParams: NetworkTypes.FileUserRequestGetSharedParams = {
    walletaddr: address,
    walletpubkey: publicKey,
    sharelink,
  };
  const callResultRequestGetShared = await Network.sendUserRequestGetShared([extraParams]);

  const { response: responseRequestGetShared } = callResultRequestGetShared;

  if (!responseRequestGetShared) {
    dirLog('we dont have response for dl request. it might be an error', callResultRequestGetShared);
    throw new Error('We dont have response to request get shared call');
  }

  const { return: requestGetSharedReturn, reqid, filehash, sequencenumber } = responseRequestGetShared.result;

  if (parseInt(requestGetSharedReturn, 10) < 0) {
    throw new Error(
      `return field in the request get shared response contains an error. Error code "${requestGetSharedReturn}"`,
    );
  }

  if (parseInt(requestGetSharedReturn, 10) !== 4) {
    throw new Error(
      `return field in the response to request get shared has an unexpected code "${requestGetSharedReturn}". Expected code was "4"`,
    );
  }

  if (!reqid || !filehash || !sequencenumber) {
    dirLog('we dont have required fields in the response ', responseRequestGetShared);
    throw new Error('required fields "reqid" or "filehash" or "sequencenumber" are missing in the response');
  }

  const messageToSign = `${filehash}${address}${sequencenumber}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParamsForDownload: NetworkTypes.FileUserRequestDownloadSharedParams = {
    filehash,
    walletaddr: address,
    walletpubkey: publicKey,
    signature,
    reqid,
  };

  const callResultRequestDownloadShared = await Network.sendUserRequestDownloadShared([
    extraParamsForDownload,
  ]);

  const { response: responseRequestDownloadShared } = callResultRequestDownloadShared;

  if (!responseRequestDownloadShared) {
    dirLog(
      'we dont have response for download shared request. it might be an error',
      callResultRequestDownloadShared,
    );
    throw new Error('We dont have response to request download shared call');
  }

  const { result: resultWithOffesets } = responseRequestDownloadShared;

  const {
    return: requestDownloadSharedReturn,
    reqid: reqidDownloadShared,
    offsetstart: offsetstartInit,
    offsetend: offsetendInit,
  } = resultWithOffesets;

  if (parseInt(requestDownloadSharedReturn, 10) < 0) {
    throw new Error(
      `return field in the request download shared response contains an error. Error code "${requestDownloadSharedReturn}"`,
    );
  }

  if (parseInt(requestDownloadSharedReturn, 10) !== 2) {
    throw new Error(
      `return field in the response to request download shared has an unexpected code "${requestDownloadSharedReturn}". Expected code was "4"`,
    );
  }

  if (!reqidDownloadShared) {
    dirLog('we dont have required fields in the download shared response ', responseRequestDownloadShared);
    throw new Error('required fields "reqid"  is missing in the response');
  }

  if (offsetendInit === undefined) {
    dirLog('a we dont have an offest. could be an error. response is', responseRequestDownloadShared);
    return;
  }

  if (offsetstartInit === undefined) {
    dirLog('b we dont have an offest. could be an error. response is', responseRequestDownloadShared);
    return;
  }

  const decodedFile = await processUsedFileDownload<NetworkTypes.FileUserRequestDownloadSharedResponse>(
    responseRequestDownloadShared,
    filehash,
  );

  if (!decodedFile) {
    throw new Error(
      `Could not process download of the user shared file for the "${filehash}" into "${filePathToSave}"`,
    );
  }

  log(`downloaded shared file will be saved into ${filePathToSave}`, filePathToSave);

  FilesystemService.writeFile(filePathToSave, decodedFile);
};
