import path from 'path';
import { FILE_STATUS_CHECK_MAX_ATTEMPTS, FILE_STATUS_CHECK_WAIT_TIME } from '../../config/remotefs';
import * as WalletTypes from '../../crypto/hdVault/hdVaultTypes';
import * as keyUtils from '../../crypto/hdVault/keyUtils';
import { filesystemApi } from '../../filesystem';
import { networkApi, networkTypes } from '../../network';
import { delay, getTimestampInSeconds } from '../../services/helpers';
import { getCurrentSequenceString } from './remoteCommon';
import * as SdsTypes from './types';
import { UPLOAD_CODES } from './types';

export const getUploadedFilesStatus = async (
  keypair: WalletTypes.KeyPairInfo,
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

  const callResultGetFileStatus = await networkApi.sendUserRequestGetFileStatus(extraParamsForGetFileStatus);

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
  keypair: WalletTypes.KeyPairInfo,
  page = 0,
): Promise<SdsTypes.UserFileListResponse> => {
  const { address, publicKey } = keypair;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${address}${timestamp}`;
  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParams: networkTypes.FileUserRequestListParams[] = [
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

  const callResult = await networkApi.sendUserRequestList(extraParams);

  const { response } = callResult;

  if (!response) {
    throw 'Could not fetch a list of files. No response in the call result';
  }

  const userFiles = response.result.fileinfo;

  return {
    originalResponse: callResult.response!,
    files: userFiles,
  };
};

export const getAllUploadedFileList = async (
  keypair: WalletTypes.KeyPairInfo,
): Promise<networkTypes.FileInfoItem[]> => {
  let currentPage = 0;
  const resultFileList: networkTypes.FileInfoItem[] = [];
  let weContinue = true;

  do {
    const userFileList = await getUploadedFileList(keypair, currentPage);

    const { originalResponse, files } = userFileList;

    const totalNumber = originalResponse?.result?.totalnumber;

    console.log(`number files on page ${currentPage} is ${files?.length}, totalNumber is ${totalNumber}`);
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

const sendUserUploadSignRequest = async (
  fileHash: string,
  keypair: WalletTypes.KeyPairInfo,
  progressCb: (data: SdsTypes.ProgressCbData) => void = () => {},
): Promise<boolean> => {
  const { address, publicKey } = keypair;
  const sequenceUploadSign = await getCurrentSequenceString(address);

  const timestampUploadSign = getTimestampInSeconds();
  const messageUploadSign = `${fileHash}${address}${sequenceUploadSign}${timestampUploadSign}`;
  const signatureUploadSign = await keyUtils.signWithPrivateKey(messageUploadSign, keypair.privateKey);

  const extraParamsUploadSign = [
    {
      filehash: fileHash,
      signature: {
        address,
        pubkey: publicKey,
        signature: signatureUploadSign,
      },
      req_time: timestampUploadSign,
      sequencenumber: sequenceUploadSign,
    },
  ];

  const callUploadSignResult = await networkApi.sendUserUploadSign(extraParamsUploadSign);

  const { response: responseUploadSign } = callUploadSignResult;

  if (!responseUploadSign) {
    const errorMsg = `There was an error during the upload sign. "response" from the request is empty , Details: (${callUploadSignResult})`;
    progressCb({
      result: { success: false, code: UPLOAD_CODES.USER_UPLOAD_DATA_USER_SIGN_FAIL },
      error: {
        message: errorMsg,
        details: { callUploadSignResult },
      },
    });

    throw new Error(errorMsg);
  }

  const {
    result: { return: uploadSignReturnValue },
  } = responseUploadSign;

  if (uploadSignReturnValue !== '0') {
    const errorMsg = `There was an error during the upload sign. Non 0 code was returned, Details: (${responseUploadSign})`;
    progressCb({
      result: { success: false, code: UPLOAD_CODES.USER_UPLOAD_DATA_USER_SIGN_FAIL },
      error: {
        message: errorMsg,
        details: { callUploadSignResult },
      },
    });

    throw new Error(errorMsg);
  }

  return true;
};

// helper, used in updloadFileFromBuffer
const getOffsetsAndResultFromRequestUpload = async (
  extraParams: networkTypes.FileUserRequestUploadParams[],
) => {
  const callResultInit = await networkApi.sendUserRequestUpload(extraParams);

  const { response: responseInit } = callResultInit;

  const errorsList: string[] = [];

  if (!responseInit) {
    errorsList.push(
      `params for sendUserRequestUpload which we had when the error occured. ${JSON.stringify(extraParams)}`,
    );
    errorsList.push('we dont have response. it might be an error.');
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

// 3s ? in updloadFileFromBuffer - changed
// helper
const getUserRequestUploadParams = async (
  keypair: WalletTypes.KeyPairInfo,
  filehash: string,
  filename: string,
  filesize: number,
  sequence: string,
): Promise<networkTypes.FileUserRequestUploadParams[]> => {
  const { address, publicKey } = keypair;

  const timestamp = getTimestampInSeconds();
  const messageToSign = `${filehash}${address}${sequence}${timestamp}`;

  const signature = await keyUtils.signWithPrivateKey(messageToSign, keypair.privateKey);

  const extraParams: networkTypes.FileUserRequestUploadParams[] = [
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

// 4s ? in updloadFileFromBuffer twice - changed
// helper
const getUserUploadDataParams = async (
  keypair: WalletTypes.KeyPairInfo,
  filehash: string,
  encodedFileChunk: string,
  sequenceUpload: string,
  stop = false,
): Promise<networkTypes.FileUserUploadDataParams[]> => {
  const { address, publicKey } = keypair;
  const timestampForUpload = getTimestampInSeconds();
  const messageToSignForUpload = `${filehash}${address}${sequenceUpload}${timestampForUpload}`;

  const signatureForUpload = await keyUtils.signWithPrivateKey(messageToSignForUpload, keypair.privateKey);

  const extraParamsForUpload: networkTypes.FileUserUploadDataParams[] = [
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

// no sequence here
// uses 1 const getUserRequestUploadParams = async (
// uses 2 const getUserUploadDataParams = async (
export const updloadFileFromBuffer = async (
  keypair: WalletTypes.KeyPairInfo,
  fileBuffer: Buffer,
  resolvedFileName: string,
  fileHash: string,
  fileSize: number,
  progressCb: (data: SdsTypes.ProgressCbData) => void = () => {},
): Promise<{ uploadReturn: string; filehash: string; fileStatusInfo: SdsTypes.UploadedFileStatusInfo }> => {
  const { address } = keypair;

  const sequence = await getCurrentSequenceString(address);
  const extraParams = await getUserRequestUploadParams(
    keypair,
    fileHash,
    resolvedFileName,
    fileSize,
    sequence,
  );

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
    const errorMsg = 'looks like the file was already sent. will try to reset its progress';
    progressCb({
      result: { success: false, code: UPLOAD_CODES.USER_REQUEST_UPLOAD_FILE_ALREADY_SENT },
      error: {
        message: errorMsg,
        details: { isContinueGlobal },
      },
    });

    const extraParamsForUpload = await getUserUploadDataParams(keypair, fileHash, '', sequence, true);

    const callResultUpload = await networkApi.sendUserUploadData(extraParamsForUpload);

    const { response: responseUploadToTest } = callResultUpload;

    const resMsg = 'responseUploadToTest after sending the stop to sendUserUploadData';

    progressCb({
      result: { success: true, message: resMsg, code: UPLOAD_CODES.USER_UPLOAD_DATA_REQUEST_SENT },
    });

    try {
      const {
        result: { return: returnStop },
      } = responseUploadToTest!;

      if (+returnStop === -14) {
        const resMsgU = 'we have stopped the upload succesfully. sending request upload again';

        progressCb({
          result: {
            success: true,
            code: UPLOAD_CODES.USER_UPLOAD_DATA_PROCESS_STOPPED,
            message: resMsgU,
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

  let uploadReturn = '';

  while (isContinueGlobal === 1) {
    const fileChunk = readBinaryFile.slice(offsetStartGlobal, offsetEndGlobal);

    if (!fileChunk) {
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
      const encodedFileChunk = await filesystemApi.encodeBuffer(fileChunk);

      readSize = readSize + fileChunk.length;

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
        const extraParamsForUpload = await getUserUploadDataParams(
          keypair,
          fileHash,
          encodedFileChunk,
          sequence,
        );

        const callResultUpload = await networkApi.sendUserUploadData(extraParamsForUpload);

        const { response: responseUploadToTest } = callResultUpload;

        if (!responseUploadToTest) {
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
                fileHash,
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
        const errorMsg = `--- ERROR 3 - we dont have an offest. could be an error. response is:  ${JSON.stringify(
          responseUpload,
        )}`;

        progressCb({
          result: {
            success: false,
            code: UPLOAD_CODES.USER_UPLOAD_DATA_NO_OFFSET_END,

            message: errorMsg,
            details: { offsetendUpload },
          },
        });
        break;
      }

      if (offsetstartUpload === undefined) {
        const errorMsg = `--- ERROR 4 - we dont have an offest. could be an error. response is:  ${JSON.stringify(
          responseUpload,
        )}`;

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

  progressCb({
    result: {
      success: true,
      code: UPLOAD_CODES.USER_UPLOAD_DATA_COMPLETED,
      message: `the latest upload return code / value is: ${uploadReturn}`,
      details: { uploadReturn, fileHash },
    },
  });

  if (isContinueGlobal !== 0) {
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

  const isUploadSigned = await sendUserUploadSignRequest(fileHash, keypair, progressCb);

  if (!isUploadSigned) {
    const errorMsg = `There was an error during the upload sign. isUploadSigned is false`;
    progressCb({
      result: { success: false, code: UPLOAD_CODES.USER_UPLOAD_DATA_USER_SIGN_FAIL },
      error: {
        message: errorMsg,
        details: { isUploadSigned },
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

  return uploadResult;
};

// wrapper. uses updloadFileFromBuffer
export const updloadFile = async (
  keypair: WalletTypes.KeyPairInfo,
  fileReadPath: string,
): Promise<{ uploadReturn: string; filehash: string; fileStatusInfo: SdsTypes.UploadedFileStatusInfo }> => {
  const imageFileName = path.basename(fileReadPath);

  const fileInfo = await filesystemApi.getFileInfo(fileReadPath);

  const readBinaryFile = await filesystemApi.getFileBuffer(fileReadPath);

  return updloadFileFromBuffer(keypair, readBinaryFile, imageFileName, fileInfo.filehash, fileInfo.size);
};
