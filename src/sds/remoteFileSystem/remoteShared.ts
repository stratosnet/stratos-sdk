import * as WalletTypes from '../../crypto/hdVault/hdVaultTypes';
import * as keyUtils from '../../crypto/hdVault/keyUtils';
import { filesystemApi } from '../../filesystem';
import { networkApi, networkTypes } from '../../network';
import { dirLog, getTimestampInSeconds, log } from '../../services/helpers';
import { getCurrentSequenceString } from './remoteCommon';
import { processUsedFileDownload } from './remoteDownload';
import * as SdsTypes from './types';

export const shareFile = async (
  keypair: WalletTypes.KeyPairInfo,
  filehash: string,
  durationInDays = 180,
): Promise<{ filehash: string; sharelink: string; shareid: string }> => {
  const { address, publicKey } = keypair;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${filehash}${address}${timestamp}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const durationInSec =
    durationInDays *
    24 * // in hours
    60 * // in minutes
    60; // in seconds

  const extraParams: networkTypes.FileUserRequestShareParams = {
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

  const callResultRequestShare = await networkApi.sendUserRequestShare([extraParams]);

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

export const stopFileSharing = async (
  keypair: WalletTypes.KeyPairInfo,
  shareid: string,
): Promise<boolean> => {
  const { address, publicKey } = keypair;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${shareid}${address}${timestamp}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
  const extraParams: networkTypes.FileUserRequestStopShareParams = {
    shareid,
    signature: {
      address,
      pubkey: publicKey,
      signature,
    },
    req_time: timestamp,
  };

  const callResultRequestStopShare = await networkApi.sendUserRequestStopShare([extraParams]);

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
  keypair: WalletTypes.KeyPairInfo,
  page = 0,
): Promise<{ files: networkTypes.SharedFileInfoItem[]; totalnumber: number }> => {
  const { address, publicKey } = keypair;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${address}${timestamp}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParams: networkTypes.FileUserRequestListShareParams = {
    page,
    signature: {
      address,
      pubkey: publicKey,
      signature,
    },
    req_time: timestamp,
  };

  const callResultRequestListShare = await networkApi.sendUserRequestListShare([extraParams]);

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

export const getAllSharedFileList = async (
  keypair: WalletTypes.KeyPairInfo,
): Promise<networkTypes.FileInfoItem[]> => {
  let currentPage = 0;
  const resultFileList: networkTypes.FileInfoItem[] = [];
  let weContinue = true;

  do {
    const userSharedFileList = await getSharedFileList(keypair, currentPage);

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

// 5s - no changes needed
export const downloadSharedFileToBuffer = async (
  keypair: WalletTypes.KeyPairInfo,
  sharelink: string, // with or without sds://
  filesize: number,
  progressCb: (data: SdsTypes.ProgressCbData) => void = () => {},
): Promise<{ downloadedFile: Buffer; originalFileName: string }> => {
  const { address, publicKey } = keypair;

  const sequence = await getCurrentSequenceString(address);

  const filelink = sharelink.startsWith('sds://') ? sharelink.trim() : `sds://${sharelink.trim()}`;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${filelink.substring(6)}${address}${sequence}${timestamp}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParams: networkTypes.FileUserRequestGetSharedParams = {
    signature: {
      address,
      pubkey: publicKey,
      signature,
    },
    req_time: timestamp,
    sharelink: filelink,
  };

  const callResultRequestGetShared = await networkApi.sendUserRequestGetShared([extraParams]);

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

  const {
    return: requestGetSharedReturn,
    reqid: reqidDownloadFile,
    filehash,
    filename: originalFileName,
    offsetstart: offsetstartInit,
    offsetend: offsetendInit,
  } = resultWithOffesets;

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

  const decodedFile = await processUsedFileDownload<networkTypes.FileUserRequestDownloadResponse>(
    responseRequestGetShared,
    filehash,
    filesize,
    progressCb,
  );

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

export const downloadSharedFile = async (
  keypair: WalletTypes.KeyPairInfo,
  filePathToSave: string,
  sharelink: string, // with or without sds://
  filesize: number,
  progressCb: (data: SdsTypes.ProgressCbData) => void = (data: unknown) => {
    console.log('data passed to callback', data);
  },
): Promise<{ filePathToSave: string }> => {
  const { downloadedFile, originalFileName } = await downloadSharedFileToBuffer(
    keypair,
    sharelink,
    filesize,
    progressCb,
  );

  if (!downloadedFile) {
    throw new Error(
      `Could not process download of the user shared file for the "${sharelink}" into "${filePathToSave}"`,
    );
  }

  const filePathToSaveWithOriginalName = `${filePathToSave}_${originalFileName}`;

  log(
    `Downloaded shared file will be saved into ${filePathToSaveWithOriginalName}`,
    filePathToSaveWithOriginalName,
  );

  filesystemApi.writeFile(filePathToSaveWithOriginalName, downloadedFile);

  return { filePathToSave: filePathToSaveWithOriginalName };
};

// 6s - no changes needed
export const getSharedFileInfo = async (
  keypair: WalletTypes.KeyPairInfo,
  sharelink: string, // with or without sds://
): Promise<{
  requestGetSharedReturn: networkTypes.ReturnCodeType;
  filehash: string;
  originalFileName: string;
  filesize: number;
  requestReturnDetail: string;
}> => {
  const { address, publicKey } = keypair;

  const sequence = await getCurrentSequenceString(address);

  const filelink = sharelink.startsWith('sds://') ? sharelink.trim() : `sds://${sharelink.trim()}`;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${filelink.substring(6)}${address}${sequence}${timestamp}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParams: networkTypes.FileUserRequestGetSharedParams = {
    signature: {
      address,
      pubkey: publicKey,
      signature,
    },
    req_time: timestamp,
    sharelink: filelink,
  };

  const callResultRequestGetShared = await networkApi.sendUserRequestGetShared([extraParams]);

  const { response: responseRequestGetShared } = callResultRequestGetShared;

  if (!responseRequestGetShared) {
    const errorMsg = 'Error. There is no response for download shared file request.';

    throw new Error(errorMsg);
  }

  const { result: resultWithOffesets } = responseRequestGetShared;

  const {
    return: requestGetSharedReturn,
    detail,
    filehash,
    filename: originalFileName,
    filesize,
  } = resultWithOffesets;

  return {
    filehash,
    originalFileName,
    requestGetSharedReturn,
    requestReturnDetail: detail || '',
    filesize,
  };
};
