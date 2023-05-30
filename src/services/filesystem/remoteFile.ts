import fs from 'fs';
import path from 'path';
import * as accounts from '../../accounts';
import { wallet } from '../../hdVault';
import * as keyUtils from '../../hdVault/keyUtils';
import * as FilesystemService from '../../services/filesystem';
import { log, delay, dirLog } from '../../services/helpers';
import * as Network from '../../services/network';

export const downloadFile = async (
  keypair: wallet.KeyPairInfo,
  filePathToSave: string,
  filehashA: string,
  filesizeA: number,
): Promise<void> => {
  const { address, publicKey } = keypair;

  const ozoneBalance = await accounts.getOtherBalanceCardMetrics(address);

  const { detailedBalance } = ozoneBalance;

  if (!detailedBalance) {
    throw new Error('no sequence is presented in the ozone balance response');
  }

  const { sequence } = detailedBalance;

  const filehash = filehashA;
  const filesize = filesizeA;

  const sdmAddress = address;
  const filehandle = `sdm://${sdmAddress}/${filehash}`;

  log('filehandle', filehandle);

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
    return;
  }

  const { result: resultWithOffesets } = responseRequestDl;

  let offsetStartGlobal = 0;
  let offsetEndGlobal = 0;
  let isContinueGlobal = 0;

  const fileInfoChunks = [];

  const {
    return: isContinueInit,
    reqid,
    offsetstart: offsetstartInit,
    offsetend: offsetendInit,
    filedata,
  } = resultWithOffesets;

  const responseDownloadInitFormatted = { isContinueInit, offsetstartInit, offsetendInit };

  dirLog('responseDownloadInitFormatted', responseDownloadInitFormatted);

  if (offsetendInit === undefined) {
    dirLog('a we dont have an offest. could be an error. response is', responseRequestDl);
    return;
  }

  if (offsetstartInit === undefined) {
    dirLog('b we dont have an offest. could be an error. response is', responseRequestDl);
    return;
  }

  isContinueGlobal = +isContinueInit;
  offsetStartGlobal = +offsetstartInit;
  offsetEndGlobal = +offsetendInit;

  const fileChunk = { offsetstart: offsetStartGlobal, offsetend: offsetEndGlobal, filedata };

  fileInfoChunks.push(fileChunk);

  while (isContinueGlobal === 2) {
    log('will call download confirmation for ', offsetStartGlobal, offsetEndGlobal);

    const extraParamsForDownload = [
      {
        filehash,
        reqid,
      },
    ];

    const callResultDownload = await Network.sendUserDownloadData(extraParamsForDownload);

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
    const extraParamsForDownload = [
      {
        filehash,
        filesize,
        reqid,
      },
    ];

    const callResultDownloadFileInfo = await Network.sendUserDownloadedFileInfo(extraParamsForDownload);

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

  log(`file will be saved into ${filePathToSave}`, filePathToSave);

  FilesystemService.writeFile(filePathToSave, decodedFile);
};

export const updloadFile = async (keypair: wallet.KeyPairInfo, fileReadPath: string): Promise<void> => {
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

  log('beginning init call');
  const callResultInit = await Network.sendUserRequestUpload(extraParams);

  const { response: responseInit } = callResultInit;

  log('call result init (end of init)', JSON.stringify(callResultInit));

  if (!responseInit) {
    log('we dont have response. it might be an error', callResultInit);
    return;
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
    return;
  }

  if (offsetstartInit === undefined) {
    log('we dont have an offest start for init. could be an error. response is', responseInit);
    return;
  }

  let readSize = 0;
  let completedProgress = 0;

  isContinueGlobal = +isContinueInit;
  offsetStartGlobal = +offsetstartInit;
  offsetEndGlobal = +offsetendInit;

  log('starting to get file buffer');
  const readBinaryFile = await FilesystemService.getFileBuffer(fileReadPath);
  log('ended  get file buffer');

  while (isContinueGlobal === 1) {
    log('!!! while start, starting getting a slice');

    const fileChunk = readBinaryFile.slice(offsetStartGlobal, offsetEndGlobal);
    log('slice is retrieved');

    if (!fileChunk) {
      log('fileChunk is missing, Exiting ', fileChunk);
      break;
    }

    if (fileChunk) {
      log('encodeBuffer start');
      const encodedFileChunk = await FilesystemService.encodeBuffer(fileChunk);
      log('encodeBuffer end');

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
        log('we dont have response. it might be an error', callResultUpload);

        return;
      }

      const {
        result: { offsetend: offsetendUpload, offsetstart: offsetstartUpload, return: isContinueUpload },
      } = responseUpload;

      if (offsetendUpload === undefined) {
        log('1 we dont have an offest. could be an error. response is', responseUpload);
        return;
      }

      if (offsetstartUpload === undefined) {
        log('2 we dont have an offest. could be an error. response is', responseUpload);
        return;
      }

      isContinueGlobal = +isContinueUpload;
      offsetStartGlobal = +offsetstartUpload;
      offsetEndGlobal = +offsetendUpload;
      log('while end ___');
    }
  }

  log(`The latest upload request return code is "${isContinueGlobal}"`);

  if (isContinueGlobal !== 0) {
    const errorMsg = `There was an error during the upload. "return" from the request is "${isContinueGlobal}"`;
    throw new Error(errorMsg);
  }
};
