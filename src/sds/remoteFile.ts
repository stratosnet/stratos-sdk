import path from 'path';
import * as accounts from '../accounts';
import { FILE_STATUS_CHECK_WAIT_TIME, FILE_STATUS_CHECK_MAX_ATTEMPTS } from '../config/remotefs';
import { wallet } from '../hdVault';
import * as keyUtils from '../hdVault/keyUtils';
import * as FilesystemService from '../services/filesystem';
import { delay, log, dirLog, getTimestampInSeconds } from '../services/helpers';
import * as Network from '../services/network';
import { sendUserRequestList } from '../services/network';
import * as NetworkTypes from '../services/network/types';
import * as SdsTypes from './types';

export const UPLOAD_CODES = {
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

const processUsedFileDownload = async <T extends NetworkTypes.FileUserRequestDownloadResponse>(
  responseRequestDownloadShared: T,
  filehash: string,
  filesize: number,
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

  let readSize = 0;

  let completedProgress = 0;

  let dlPartSize = offsetEndGlobal - 1 - offsetStartGlobal;

  readSize = readSize + dlPartSize;

  completedProgress = (100 * readSize) / filesize;

  const completedProgressMessage = `completed ${readSize} from ${filesize} bytes, or ${(
    Math.round(completedProgress * 100) / 100
  ).toFixed(2)}%`;

  log('2 We have a correct responseRequestDownload', completedProgressMessage);

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
      dirLog(
        '-- ERROR processUsedFileDownload - we dont have response. it might be an error',
        callResultDownload,
      );

      return;
    }

    const { return: dlReturn, offsetstart: dlOffsetstart, offsetend: dlOffsetend } = responseDownload.result;
    const responseDownloadFormatted = { dlReturn, dlOffsetstart, dlOffsetend };
    dirLog('ResponseDownloadFormatted (without downloadedFileData)', responseDownloadFormatted);

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

      dlPartSize = offsetEndGlobal - 1 - offsetStartGlobal;

      readSize = readSize + dlPartSize;
      completedProgress = (100 * readSize) / filesize;

      const completedProgressMessage = `completed ${readSize} from ${filesize} bytes, or ${(
        Math.round(completedProgress * 100) / 100
      ).toFixed(2)}%`;

      log('3 We have a correct responseDownload', completedProgressMessage);
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

    dirLog('Call result download', callResultDownloadFileInfo);

    const { response: responseDownloadFileInfo } = callResultDownloadFileInfo;

    downloadConfirmed = responseDownloadFileInfo?.result?.return || '-1';

    log('ResponseDownloadFileInfo', responseDownloadFileInfo);
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

export const getUploadedFilesStatus = async (
  keypair: wallet.KeyPairInfo,
  fileHash: string,
  progressCb: (data: SdsTypes.ProgressCbData) => void = () => {},
): Promise<SdsTypes.UploadedFileStatusInfo> => {
  const { address, publicKey } = keypair;
  const timestamp = getTimestampInSeconds();
  const messageForUploadStatusToSign = `${fileHash}${address}${timestamp}`;

  const signatureForUploadStatus = await keyUtils.signWithPrivateKey(
    messageForUploadStatusToSign,
    keypair.privateKey,
  );

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
      code: UPLOAD_CODES.GET_FILE_STATUS,
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
        code: UPLOAD_CODES.GET_FILE_STATUS_NO_RESPONSE,
      },
      error: {
        message: errorMsg,
        details: { responseGetFileStatus, callResultGetFileStatus },
      },
    });

    throw new Error(errorMsg);
  }

  const { result: updloadedFileStatusResult } = responseGetFileStatus;

  const {
    return: requestGetFileStatusReturn,
    file_upload_state: fileUploadState,
    user_has_file: userHasFile,
    replicas,
  } = updloadedFileStatusResult;

  if (parseInt(requestGetFileStatusReturn, 10) !== 0) {
    // throw new Error(
    //   `return field in the request get file status response contains an error. Error code "${requestGetFileStatusReturn}"`,
    // );
    const errorMsg = `return field in the file status response has an error. It must be equal to 0. Error code "${requestGetFileStatusReturn}"`;

    progressCb({
      result: { success: false, code: UPLOAD_CODES.GET_FILE_STATUS_NOT_NUMBER },
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

export const getUploadedFileList = async (
  keypair: wallet.KeyPairInfo,
  page = 0,
): Promise<SdsTypes.UserFileListResponse> => {
  const { address, publicKey } = keypair;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${address}${timestamp}`;
  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParams: NetworkTypes.FileUserRequestListParams[] = [
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
  filesize: number,
): Promise<{ filePathToSave: string }> => {
  const { address, publicKey } = keypair;

  const sequence = await getCurrentSequenceString(address);

  const filehandle = `sdm://${address}/${filehash}`;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${filehash}${address}${sequence}${timestamp}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParams: NetworkTypes.FileUserRequestDownloadParams[] = [
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
    dirLog('-- ERROR - we dont have response for dl request.', callResultRequestDl);
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
    dirLog('--- ERROR a we dont have an offest. could be an error. response is', responseRequestDl);
    throw new Error('a we dont have an offest. could be an error. response is');
  }

  if (offsetstartInit === undefined) {
    dirLog('--- ERROR b we dont have an offest. could be an error. response is', responseRequestDl);
    throw new Error('b we dont have an offest. could be an error. response is');
  }

  const decodedFile = await processUsedFileDownload<NetworkTypes.FileUserRequestDownloadResponse>(
    responseRequestDl,
    filehash,
    filesize,
  );

  if (!decodedFile) {
    throw new Error(
      `Could not process download of the user file for the "${filehash}" into "${filePathToSave}"`,
    );
  }

  log(`Downloaded user file will be saved into ${filePathToSave}`, filePathToSave);

  FilesystemService.writeFile(filePathToSave, decodedFile);

  return { filePathToSave };
};

const getCurrentSequenceString = async (address: string) => {
  const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);

  const { detailedBalance } = ozoneBalance;

  if (!detailedBalance) {
    throw new Error('no sequence is presented in the ozone balance response');
  }

  const { sequence } = detailedBalance;

  return sequence;
};

const getUserRequestUploadParams = async (
  keypair: wallet.KeyPairInfo,
  filehash: string,
  filename: string,
  filesize: number,
): Promise<NetworkTypes.FileUserRequestUploadParams[]> => {
  const { address, publicKey } = keypair;
  const sequence = await getCurrentSequenceString(address);

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${filehash}${address}${sequence}${timestamp}`;
  // log('MessageToSign for userRequestUpload', messageToSign);

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParams: NetworkTypes.FileUserRequestUploadParams[] = [
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

const getOffsetsAndResultFromRequestUpload = async (
  extraParams: NetworkTypes.FileUserRequestUploadParams[],
) => {
  const callResultInit = await Network.sendUserRequestUpload(extraParams);

  const { response: responseInit } = callResultInit;

  // log('call result init (end of init)', JSON.stringify(callResultInit));

  const errorsList: String[] = [];

  if (!responseInit) {
    errorsList.push(
      `params for sendUserRequestUpload which we had when the error occured. ${JSON.stringify(extraParams)}`,
    );
    errorsList.push('we dont have response. it might be an error.');
    // log('params for sendUserRequestUpload which we had when the error occured', extraParams);
    // log('we dont have response. it might be an error', callResultInit);
    // throw new Error('we dont have response. it might be an error');
    return { responseInit, isContinueInit: 0, callResultInit, errorsList };
  }

  const { result: resultWithOffesets } = responseInit;

  const {
    offsetend: offsetendInit,
    offsetstart: offsetstartInit,
    return: isContinueInit,
  } = resultWithOffesets;

  return { offsetstartInit, offsetendInit, isContinueInit, responseInit, callResultInit, errorsList };
};

const getUserUploadDataParams = async (
  keypair: wallet.KeyPairInfo,
  filehash: string,
  encodedFileChunk: string,
  stop = false,
): Promise<NetworkTypes.FileUserUploadDataParams[]> => {
  const { address, publicKey } = keypair;
  const timestampForUpload = getTimestampInSeconds();
  const sequenceUpload = await getCurrentSequenceString(address);
  const messageToSignForUpload = `${filehash}${address}${sequenceUpload}${timestampForUpload}`;

  const signatureForUpload = await keyUtils.signWithPrivateKey(messageToSignForUpload, keypair.privateKey);

  const extraParamsForUpload: NetworkTypes.FileUserUploadDataParams[] = [
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

export const updloadFile = async (
  keypair: wallet.KeyPairInfo,
  fileReadPath: string,
): Promise<{ uploadReturn: string; filehash: string; fileStatusInfo: SdsTypes.UploadedFileStatusInfo }> => {
  const imageFileName = path.basename(fileReadPath);

  const fileInfo = await FilesystemService.getFileInfo(fileReadPath);

  const readBinaryFile = await FilesystemService.getFileBuffer(fileReadPath);

  return updloadFileFromBuffer(keypair, readBinaryFile, imageFileName, fileInfo.filehash, fileInfo.size);
};

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

export const updloadFileFromBuffer = async (
  keypair: wallet.KeyPairInfo,
  fileBuffer: Buffer,
  resolvedFileName: string,
  fileHash: string,
  fileSize: number,
  progressCb: (data: SdsTypes.ProgressCbData) => void = () => {},
): Promise<{ uploadReturn: string; filehash: string; fileStatusInfo: SdsTypes.UploadedFileStatusInfo }> => {
  // console.log('given fileBuffer to the sdk', fileBuffer);

  const extraParams = await getUserRequestUploadParams(keypair, fileHash, resolvedFileName, fileSize);
  // console.log('extraParams for getUserRequestUploadParams', extraParams);

  const {
    errorsList: initErrorsList,
    responseInit,
    callResultInit,
    offsetstartInit,
    offsetendInit,
    isContinueInit,
  } = await getOffsetsAndResultFromRequestUpload(extraParams);

  if (initErrorsList.length) {
    const errorMsg = 'sendUserRequestUpload has returned an error';
    progressCb({
      result: { success: false, code: UPLOAD_CODES.USER_REQUEST_UPLOAD_ERROR },
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

  offsetStartGlobal = offsetstartInit!;
  offsetEndGlobal = offsetendInit!;

  if (isContinueGlobal === -13) {
    // log('looks like the file was already sent. will try to reset its progress');

    const errorMsg = 'looks like the file was already sent. will try to reset its progress';
    progressCb({
      result: { success: false, code: UPLOAD_CODES.USER_REQUEST_UPLOAD_FILE_ALREADY_SENT },
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
      result: { success: true, message: resMsg, code: UPLOAD_CODES.USER_UPLOAD_DATA_REQUEST_SENT },
    });

    try {
      const {
        result: { return: returnStop },
      } = responseUploadToTest!;

      if (+returnStop === -14) {
        // log('we have stopped the upload succesfully. sending request upload again');

        const resMsg = 'we have stopped the upload succesfully. sending request upload again';

        progressCb({
          result: {
            success: true,
            code: UPLOAD_CODES.USER_UPLOAD_DATA_PROCESS_STOPPED,
            message: resMsg,
            details: { returnStop },
          },
        });

        const { responseInit, offsetstartInit, offsetendInit, isContinueInit } =
          await getOffsetsAndResultFromRequestUpload(extraParams);

        responseInitGlobal = responseInit;
        isContinueGlobal = +isContinueInit;

        offsetStartGlobal = +offsetstartInit!;
        offsetEndGlobal = +offsetendInit!;
      }
    } catch (error) {
      // console.log('error of stopping the upload', error);

      const errorMsg = 'we could not stop the upload. Exiting. try agian later';
      progressCb({
        result: { success: false, code: UPLOAD_CODES.USER_UPLOAD_DATA_PROCESS_STOP_FAIL },
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
      result: { success: false, code: UPLOAD_CODES.USER_REQUEST_UPLOAD_NO_OFFSET_END },
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
      result: { success: false, code: UPLOAD_CODES.USER_REQUEST_UPLOAD_NO_OFFSET_START },
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
        result: { success: false, code: UPLOAD_CODES.USER_UPLOAD_DATA_NO_FILE_CHUNK },
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
          code: UPLOAD_CODES.USER_UPLOAD_DATA_FILE_CHUNK_CORRECT,
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
            result: { success: false, code: UPLOAD_CODES.USER_UPLOAD_DATA_NO_RESPONSE },
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

          const errorMsg = `ERROR 2 --- we dont have upload response id or it has an error. ${JSON.stringify(
            callResultUpload,
          )}`;

          progressCb({
            result: { success: false, code: UPLOAD_CODES.USER_UPLOAD_DATA_NO_ID_IN_RESPONSE },
            error: {
              message: errorMsg,
              details: {
                callResultUpload,
                callResultUploadError: callResultUpload.response?.error,
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
            code: UPLOAD_CODES.USER_UPLOAD_DATA_RESPONSE_CORRECT,
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

      const {
        result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload },
      } = responseUpload;

      uploadReturn = isContinueUpload;

      isContinueGlobal = +isContinueUpload;

      if (offsetendUpload === undefined) {
        // log('--- ERROR 3 - we dont have an offest. could be an error. response is', responseUpload);

        const errorMsg = `--- ERROR 3 - we dont have an offest. could be an error. response is:  ${JSON.stringify(
          responseUpload,
        )}`;

        // log(errorMsg, responseUpload);
        progressCb({
          result: {
            success: false,
            code: UPLOAD_CODES.USER_UPLOAD_DATA_NO_OFFSET_END,

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
        const errorMsg = `--- ERROR 4 - we dont have an offest. could be an error. response is:  ${JSON.stringify(
          responseUpload,
        )}`;

        // log(errorMsg, responseUpload);
        progressCb({
          result: { success: false, code: UPLOAD_CODES.USER_UPLOAD_DATA_NO_OFFSET_START },
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
      code: UPLOAD_CODES.USER_UPLOAD_DATA_COMPLETED,
      message: `the latest upload return code / value is: ${uploadReturn}`,
      details: { uploadReturn },
    },
  });

  if (isContinueGlobal !== 0) {
    // log('oh no!!! isContinueGlobal', isContinueGlobal);

    const errorMsg = `There was an error during the upload. "return" from the request is "${isContinueGlobal}" , Details: (${uploadReturn})`;
    progressCb({
      result: { success: false, code: UPLOAD_CODES.USER_UPLOAD_DATA_NO_CONTINUE },
      error: {
        message: errorMsg,
        details: { isContinueGlobal, uploadReturn },
      },
    });
    throw new Error(errorMsg);
  }

  let updloadedFileStateGlobal = 2; // failed
  let fileStatusInfoGlobal: SdsTypes.UploadedFileStatusInfo;
  let attemptsCount = 0;

  do {
    attemptsCount += 1;

    const fileStatusInfo = await getUploadedFilesStatus(keypair, fileHash);
    const { fileUploadState } = fileStatusInfo;
    fileStatusInfoGlobal = fileStatusInfo;

    updloadedFileStateGlobal = fileUploadState;

    await delay(FILE_STATUS_CHECK_WAIT_TIME);
  } while (attemptsCount <= FILE_STATUS_CHECK_MAX_ATTEMPTS && updloadedFileStateGlobal !== 3);

  const uploadResult = {
    uploadReturn,
    filehash: fileHash,
    fileStatusInfo: fileStatusInfoGlobal,
  };

  progressCb({
    result: {
      success: true,
      code: UPLOAD_CODES.USER_UPLOAD_DATA_FINISHED,
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

export const shareFile = async (
  keypair: wallet.KeyPairInfo,
  filehash: string,
): Promise<{ filehash: string; sharelink: string; shareid: string }> => {
  const { address, publicKey } = keypair;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${filehash}${address}${timestamp}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
  const extraParams: NetworkTypes.FileUserRequestShareParams = {
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
  const { address, publicKey } = keypair;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${shareid}${address}${timestamp}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);
  const extraParams: NetworkTypes.FileUserRequestStopShareParams = {
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
  keypair: wallet.KeyPairInfo,
  page = 0,
): Promise<{ files: NetworkTypes.SharedFileInfoItem[]; totalnumber: number }> => {
  const { address, publicKey } = keypair;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${address}${timestamp}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParams: NetworkTypes.FileUserRequestListShareParams = {
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
  filesize: number,
): Promise<void> => {
  log(filePathToSave);
  const { address, publicKey } = keypair;

  const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);

  const { detailedBalance } = ozoneBalance;

  if (!detailedBalance) {
    throw new Error('no sequence is presented in the ozone balance response');
  }

  const timestampA = getTimestampInSeconds();

  const messageToSignA = `${sharelink}${address}${timestampA}`;

  const signatureA = await keyUtils.signWithPrivateKey(messageToSignA, keypair.privateKey);

  const extraParams: NetworkTypes.FileUserRequestGetSharedParams = {
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

  // const timestamp = getTimestampInSeconds();
  const messageToSign = `${filehash}${address}${sequencenumber}${timestampA}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParamsForDownload: NetworkTypes.FileUserRequestDownloadSharedParams = {
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
    filesize,
  );

  if (!decodedFile) {
    throw new Error(
      `Could not process download of the user shared file for the "${filehash}" into "${filePathToSave}"`,
    );
  }

  log(`downloaded shared file will be saved into ${filePathToSave}`, filePathToSave);

  FilesystemService.writeFile(filePathToSave, decodedFile);
};
