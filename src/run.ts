import { stratosPubkeyPrefix } from 'config/hdVault';
import { deriveKeyPair } from 'crypto/hdVault/wallet';
import dotenv from 'dotenv';
import createKeccakHash from 'keccak';
import path from 'path';
import { createClient } from 'redis';
import { hdVault } from './config';
import * as stratos from './index';
import { delay, dirLog, log } from './services/helpers';

dotenv.config();

const password = 'XXXX';

// that is the mnemonic from the .env file
const { ZERO_MNEMONIC: zeroUserMnemonic = '' } = process.env;

const sdkEnvDev = {
  restUrl: 'https://rest-dev.thestratos.org',
  rpcUrl: 'https://rpc-dev.thestratos.org',
  chainId: 'dev-0',
  explorerUrl: 'https://explorer-dev.thestratos.org',
  faucetUrl: 'https://faucet-dev.thestratos.org/credit',
};

const sdkEnvTest = {
  key: 'testnet',
  name: 'Mesos',
  restUrl: 'https://rest-mesos.thestratos.org',
  rpcUrl: 'https://rpc-mesos.thestratos.org',
  chainId: 'stratos-testnet-2',
  explorerUrl: 'https://big-dipper-mesos.thestratos.org',
  faucetUrl: 'https://faucet-mesos.thestratos.org/credit',
};

const sdkEnvMainNet = {
  key: 'mainnet',
  name: 'Mainnet',
  stratosFaucetDenom: 'stos',
  restUrl: 'https://rest.thestratos.org',
  rpcUrl: 'https://rpc.thestratos.org',
  chainId: 'stratos-1',
  explorerUrl: 'https://big-dipper.thestratos.org',
};

const runFaucet = async (hdPathIndex: number, givenMnemonic: string) => {
  const derivedKeyPair = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenMnemonic,
    hdPathIndex,
  );

  if (!derivedKeyPair) {
    return;
  }

  const walletAddress = derivedKeyPair.address;
  console.log('walletAddress', walletAddress);
  console.log('walletAddress', derivedKeyPair.privateKey);

  const faucetUrl = stratos.Sdk.environment.faucetUrl || '';
  log(`will be useing faucetUrl - "${faucetUrl}"`);

  const result = await stratos.accounts.accountsApi.increaseBalance(
    walletAddress,
    faucetUrl,
    hdVault.stratosTopDenom,
  );

  console.log('faucet result', result);
};

const getBalanceCardMetrics = async (hdPathIndex: number, givenMnemonic: string) => {
  const phrase = stratos.crypto.hdVault.mnemonic.convertStringToArray(givenMnemonic);
  const masterKeySeedInfo = await stratos.crypto.hdVault.keyManager.createMasterKeySeed(
    phrase,
    password,
    hdPathIndex,
  );
  const encryptedMasterKeySeed = masterKeySeedInfo.encryptedMasterKeySeed.toString();
  const derivedKeyPair = await stratos.crypto.hdVault.wallet.deriveKeyPair(
    hdPathIndex,
    password,
    encryptedMasterKeySeed,
  );

  if (!derivedKeyPair) {
    return;
  }
  const balanaces = await stratos.accounts.accountsApi.getBalanceCardMetrics(derivedKeyPair.address);
  // console.log('d', derivedKeyPair.privateKey)

  console.log('balanace card metrics ', balanaces);
};

const getOzoneBalance = async (hdPathIndex: number, givenMnemonic: string) => {
  const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenMnemonic,
    hdPathIndex,
  );

  if (!keyPairZero) {
    return;
  }

  const balance = await stratos.accounts.accountsApi.getOtherBalanceCardMetrics(keyPairZero.address);

  console.log(' new other balanace card metrics ', balance);
};

const mainSend = async (
  hdPathIndex: number,
  givenReceiverMnemonic = zeroUserMnemonic,
  hdPathIndexReceiver = 0,
) => {
  const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenReceiverMnemonic,
    hdPathIndex,
  );

  const keyPairOne = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenReceiverMnemonic,
    hdPathIndexReceiver,
  );

  if (!keyPairOne || !keyPairZero) {
    return;
  }

  const fromAddress = keyPairZero.address;

  const sendAmount = 1.25;

  const sendTxMessages = await stratos.chain.transactions.getSendTx(fromAddress, [
    { amount: sendAmount, toAddress: keyPairOne.address },
  ]);

  const signedTx = await stratos.chain.transactions.sign(fromAddress, sendTxMessages);

  if (signedTx) {
    try {
      const _result = await stratos.chain.transactions.broadcast(signedTx);
      console.log('broadcasting result!', _result);
    } catch (error) {
      const err: Error = error as Error;
      console.log('error broadcasting', err.message);
    }
  }

  await delay(3000);
  const balances = await stratos.accounts.accountsApi.getBalanceCardMetrics(keyPairOne.address);
  console.log('receiver balance', balances);
};

const mainSdsPrepay = async (
  hdPathIndex: number,

  givenReceiverMnemonic = zeroUserMnemonic,
) => {
  const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenReceiverMnemonic,
    hdPathIndex,
  );

  if (!keyPairZero) {
    return;
  }

  const sendTxMessages = await stratos.sds.transactions.getSdsPrepayTx(keyPairZero.address, [{ amount: 10 }]);

  dirLog('from mainSdsPrepay - calling tx sign with this messageToSign', sendTxMessages);
  const signedTx = await stratos.chain.transactions.sign(keyPairZero.address, sendTxMessages);

  let attempts = 0;
  if (signedTx) {
    try {
      console.log('from mainSdsPrepay - calling tx broadcast');
      const result = await stratos.chain.transactions.broadcast(signedTx);
      console.log('broadcast prepay result', result);
    } catch (err) {
      console.log('error broadcasting', (err as Error).message);
      if (attempts <= 2) {
        attempts += 1;
        dirLog(`attempts ${attempts}, trying again the same signedTx`, signedTx);
        const result = await stratos.chain.transactions.broadcast(signedTx);
        console.log('broadcast prepay result', result);
      }
    }
  }
};

const testRequestUserFileList = async (
  hdPathIndex: number,
  page: number,
  givenReceiverMnemonic = zeroUserMnemonic,
) => {
  const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenReceiverMnemonic,
    hdPathIndex,
  );

  if (!keyPairZero) {
    return;
  }

  const userFileList = await stratos.sds.remoteFileSystem.remoteFileSystemApi.getUploadedFileList(
    keyPairZero,
    page,
  );

  console.log('retrieved user file list', userFileList);
};

const testItFileUpFromBuffer = async (
  hdPathIndex: number,
  filename: string,
  givenReceiverMnemonic = zeroUserMnemonic,
) => {
  const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenReceiverMnemonic,
    hdPathIndex,
  );

  if (!keyPairZero) {
    return;
  }

  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const fileReadPath = path.resolve(SRC_ROOT, filename);

  const resolvedFileName = path.basename(fileReadPath);

  const fileInfo = await stratos.filesystem.filesystemApi.getFileInfo(fileReadPath);

  const bufferOfTheFile = await stratos.filesystem.filesystemApi.getFileBuffer(fileReadPath);

  const myCb = (data: stratos.sds.remoteFileSystem.remoteFileSystemTypes.ProgressCbData) => {
    const {
      result: { success, code, details, message },
      error,
    } = data;

    if (error) {
      dirLog('we have an error. data from myCb', data);
    } else if (success === false) {
      log('success is false. data from myCb', data);
    } else if (
      code ===
      stratos.sds.remoteFileSystem.remoteFileSystemTypes.UPLOAD_CODES.USER_UPLOAD_DATA_RESPONSE_CORRECT
    ) {
      log('message -', message);
    } else if (
      code === stratos.sds.remoteFileSystem.remoteFileSystemTypes.UPLOAD_CODES.USER_UPLOAD_DATA_COMPLETED
    ) {
      log('upload data completed message -', message);
    } else if (
      code === stratos.sds.remoteFileSystem.remoteFileSystemTypes.UPLOAD_CODES.USER_UPLOAD_DATA_FINISHED
    ) {
      dirLog('upload confirmed details', details);
    }
  };

  const uploadResult = await stratos.sds.remoteFileSystem.remoteFileSystemApi.updloadFileFromBuffer(
    keyPairZero,
    bufferOfTheFile,
    resolvedFileName,
    fileInfo.filehash,
    fileInfo.size,
    myCb,
  );

  log('done! function uploadResult', uploadResult);
};

const testFileDl = async (
  hdPathIndex: number,
  filename: string,
  filehash: string,
  filesize: number,
  givenReceiverMnemonic = zeroUserMnemonic,
) => {
  log(`Downloading file ${filename}`);

  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenReceiverMnemonic,
    hdPathIndex,
  );

  if (!keyPairZero) {
    return;
  }

  const filePathToSave = path.resolve(SRC_ROOT, `my_super_new_from_buff_${filename}`);

  await stratos.sds.remoteFileSystem.remoteFileSystemApi.downloadFile(
    keyPairZero,
    filePathToSave,
    filehash,
    filesize,
  );

  log('Done. filePathToSave', filePathToSave);
};

const testRequestUserSharedFileList = async (
  hdPathIndex: number,
  page: number,
  givenReceiverMnemonic = zeroUserMnemonic,
) => {
  const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenReceiverMnemonic,
    hdPathIndex,
  );

  if (!keyPairZero) {
    return;
  }

  const userFileList = await stratos.sds.remoteFileSystem.remoteFileSystemApi.getSharedFileList(
    keyPairZero,
    page,
  );

  console.log('retrieved user shared file list', userFileList);
};

const testRequestUserFileShare = async (
  hdPathIndex: number,
  filehash: string,
  givenReceiverMnemonic = zeroUserMnemonic,
) => {
  const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenReceiverMnemonic,
    hdPathIndex,
  );

  if (!keyPairZero) {
    return;
  }

  const userShareFileResult = await stratos.sds.remoteFileSystem.remoteFileSystemApi.shareFile(
    keyPairZero,
    filehash,
  );

  console.log('retrieved user shared file result', userShareFileResult);
};

const testRequestUserStopFileShare = async (
  hdPathIndex: number,
  shareid: string,
  givenReceiverMnemonic = zeroUserMnemonic,
) => {
  const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenReceiverMnemonic,
    hdPathIndex,
  );

  if (!keyPairZero) {
    return;
  }

  const userStopFileShareResult = await stratos.sds.remoteFileSystem.remoteFileSystemApi.stopFileSharing(
    keyPairZero,
    shareid,
  );

  console.log('retrieved user sotp share file result', userStopFileShareResult);
};

const testRequestUserDownloadSharedFile = async (
  hdPathIndex: number,
  sharelink: string,
  filesize: number,
  givenReceiverMnemonic = zeroUserMnemonic,
) => {
  const PROJECT_ROOT = path.resolve(__dirname, '../');
  const SRC_ROOT = path.resolve(PROJECT_ROOT, './src');

  const filePathToSave = path.resolve(SRC_ROOT, `my_super_new_from_shared_${sharelink}`);

  const keyPairZero = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(
    givenReceiverMnemonic,
    hdPathIndex,
  );

  if (!keyPairZero) {
    return;
  }

  const userDownloadSharedFileResult =
    await stratos.sds.remoteFileSystem.remoteFileSystemApi.downloadSharedFile(
      keyPairZero,
      filePathToSave,
      sharelink,
      filesize,
    );

  console.log('retrieved user download shared file list', userDownloadSharedFileResult);
};

const testBalanceRound = async () => {
  const address = 'st1p2zwnn6rdj8kexhf9ddkal6ldp65vnd24gam2l';

  const b = await stratos.accounts.accountsApi.getBalanceCardMetrics(address);

  dirLog('balance from re-delegated', b);

  const delegatedBalanceResult = await stratos.network.networkApi.getDelegatedBalance(address);
  dirLog('delegatedBalanceResult', delegatedBalanceResult);
};

async function testRedis() {
  const usr = 'default';
  const pwd = 'p@sSW0rd';

  // const usr = 'alice';
  // const pwd = 'p1pp0';

  // const usr = 'antirez';
  // const pwd = 'p2pp0';

  const redisUrl = `redis://${usr}:${pwd}@localhost:6379`;
  const redis = createClient({ url: redisUrl });
  redis.on('error', err => console.log('Redis Client Error', err));
  await redis.connect();

  const aString = await redis.ping(); // 'PONG'
  console.log('aString', aString);
  const aNumber = await redis.hSet('foo', 'alfa', '42'); // 2
  const aNumber2 = await redis.hSet('foo', 'bravo', '23'); // 2
  const aHash = await redis.hGetAll('foo'); // { alfa: '42', bravo: '23' }
  console.log('aHash', aHash);
  // await redis.flushDb();
  // await redis.flushAll();
}

export const humanStringToHexString = (input: string): string => Buffer.from(input).toString('hex');

export const hexStringToHumanString = (input: string): string => Buffer.from(input, 'hex').toString();

export const humanStringToBase64String = (input: string): string => Buffer.from(input).toString('base64');

export const base64StringToHumanString = (input: string): string => Buffer.from(input, 'base64').toString();

export const uint8arrayToHexStr = (input: Uint8Array): string => Buffer.from(input).toString('hex');

export const uint8arrayToBase64Str = (input: Uint8Array): string => Buffer.from(input).toString('base64');

export const hexToBytes = (input: string): Uint8Array => new Uint8Array(Buffer.from(input, 'hex'));

export const encodeSignatureMessage = (message: string): Uint8Array => {
  const signBytesBuffer = Buffer.from(message);
  const keccak256HashOfSigningBytes = createKeccakHash('keccak256').update(signBytesBuffer).digest();
  const signHashBuf = keccak256HashOfSigningBytes;
  const encodedMessage = Uint8Array.from(signHashBuf);
  return encodedMessage;
};

async function testEnc(): Promise<void> {
  const derivedKeyPair = await stratos.crypto.hdVault.wallet.deriveKeyPairFromMnemonic(zeroUserMnemonic, 0);
  // console.log('derivedKeyPair', derivedKeyPair);

  if (!derivedKeyPair) {
    return;
  }
  // const myTextToEncode = '123456789012345678901234567890';
  const myTextToEncode = derivedKeyPair.address;
  const sampleData = myTextToEncode;

  // const id = 0;
  // const sampleData = new Array(230_000).fill({ id: id + 1, derivedKeyPair });
  // console.log('sampleData', '\n', sampleData, '\n');

  const encodedHexString = humanStringToHexString(myTextToEncode);
  console.log('encodedHexString', encodedHexString, encodedHexString.length);

  const encodedBase64String = humanStringToBase64String(myTextToEncode);
  console.log('encodedBase64String', encodedBase64String, encodedBase64String.length);
  console.log('\n');

  // always 32 bites array
  const encodedStAddress = stratos.crypto.hdVault.keyUtils.encodeSignatureMessage(myTextToEncode);

  const encodedStAddressStringBase64 = uint8arrayToBase64Str(encodedStAddress);
  console.log(
    'encodedStAddressStringBase64',
    encodedStAddressStringBase64,
    encodedStAddressStringBase64.length,
  );

  // const encodedStAddressStringHex = uint8arrayToHexStr(encodedStAddress);

  // console.log('encodedStAddressStringHex', encodedStAddressStringHex, encodedStAddressStringHex.length);

  console.log('\n');

  const encodedStAddressStringSignedBase64 = await stratos.crypto.hdVault.keyUtils.signWithPrivateKeyInBase64(
    encodedStAddressStringBase64,
    derivedKeyPair.privateKey,
  );

  console.log(
    'encodedStAddressStringSignedBase64 (will be a redis key?)',
    encodedStAddressStringSignedBase64,
    encodedStAddressStringSignedBase64.length,
  );

  // length is 128
  // const encodedStAddressStringSignedHex = await stratos.crypto.hdVault.keyUtils.signWithPrivateKey(
  //   encodedStAddressStringHex,
  //   derivedKeyPair.privateKey,
  // );

  // console.log(
  //   'encodedStAddressStringSignedHex (will be a redis key?)',
  //   encodedStAddressStringSignedHex,
  //   encodedStAddressStringSignedHex.length,
  // );
  //
  console.log('\n');

  const signVerificationResult = await stratos.crypto.hdVault.keyUtils.verifySignatureInBase64(
    encodedStAddressStringBase64,
    encodedStAddressStringSignedBase64,
    derivedKeyPair.publicKey,
  );

  console.log('signVerificationResult base64!', signVerificationResult);

  // const signVerificationResult2 = await stratos.crypto.hdVault.keyUtils.verifySignature(
  //   encodedStAddressStringHex,
  //   encodedStAddressStringSignedHex,
  //   derivedKeyPair.publicKey,
  // );

  // console.log('signVerificationResult hex!', signVerificationResult2);

  console.log('\n');

  // console.log('sampleData', sampleData);
  // const sampleDataJsonStringified = JSON.stringify(sampleData);

  const sampleDataBuff = Buffer.from(JSON.stringify(sampleData));
  // console.log('sampleDataBuff', sampleDataBuff.length);

  const sampleDataBuffUint8 = Uint8Array.from(sampleDataBuff);
  // console.log('sampleDataBuffUint8', sampleDataBuffUint8, sampleDataBuffUint8.length);

  // const sampleDataJsonStringified = Buffer.from(JSON.stringify(sampleData)).toString('base64');
  // console.log('sampleDataJsonStringified', sampleDataJsonStringified.length);

  // const sampleDataJsonStringified2 = Buffer.from(sampleDataBuffUint8).toString('base64');
  // console.log('sampleDataJsonStringified2', sampleDataJsonStringified2.length);

  // keccak256 hash of the private key , it will give 32 bytes
  const passwordTestBytes = stratos.crypto.hdVault.keyUtils.encodeSignatureMessage(derivedKeyPair.privateKey);
  // console.log('passwordTestBytes', passwordTestBytes);

  const passwordTest = Buffer.from(passwordTestBytes).toString('base64');
  console.log('passwordTest', passwordTest);
  console.log('\n');

  const sampleDataJsonStringifiedEncrypted = stratos.chain.cosmos.cosmosUtils.encryptMasterKeySeed(
    passwordTest,
    sampleDataBuffUint8,
  );

  console.log('sampleDataJsonStringifiedEncrypted', sampleDataJsonStringifiedEncrypted.toString().length);
  // console.log('sampleDataJsonStringifiedEncrypted', sampleDataJsonStringifiedEncrypted.toString());

  // const sampleDataEncripytedEncoded = humanStringToHexString(sampleDataJsonStringifiedEncrypted.toString());
  const sampleDataEncripytedEncoded = humanStringToBase64String(
    sampleDataJsonStringifiedEncrypted.toString(),
  );

  console.log('sampleDataEncripytedEncoded', sampleDataEncripytedEncoded.length);

  console.log('\n');
  // / reverse

  const decodedFromBase64ToEncrypted = base64StringToHumanString(sampleDataEncripytedEncoded);

  console.log('decodedFromBase64ToEncrypted', decodedFromBase64ToEncrypted.length);

  const decodedDecrypted = await stratos.chain.cosmos.cosmosUtils.decryptMasterKeySeed(
    passwordTest,
    decodedFromBase64ToEncrypted,
  );

  if (!decodedDecrypted) {
    return;
  }

  console.log('decodedDecrypted', decodedDecrypted.length);
  console.log('\n');

  const decodedReadable = Buffer.from(decodedDecrypted).toString();

  const decodedOriginal = JSON.parse(decodedReadable);
  console.log('decodedOriginal', decodedOriginal);
  //  end

  // console.log('sampleDataDecrypted', sampleDataDecrypted);

  // console.log('setOfUint8BitesThree', setOfUint8BitesThree);
  // const myTxInJson = transactionBuilder.transaction();

  // const myTxInBase64 = Buffer.from(myTxInJson).toString('base64');
  // const base64data = bufferchunk.toString('base64');
  // const decodedFileBuffer = Buffer.from(econdedFileContent, 'base64');

  // const a = stratos.chain.cosmos.cosmosUtils.encryptMasterKeySeed('123')
}

async function main(): Promise<void> {
  const sdkEnv = sdkEnvDev;
  // const sdkEnv = sdkEnvTest;
  // const sdkEnv = sdkEnvMainNet;
  stratos.Sdk.init({ ...sdkEnv });

  const { resolvedChainID, resolvedChainVersion, isNewProtocol } =
    await stratos.network.networkApi.getChainAndProtocolDetails();

  stratos.Sdk.init({
    ...sdkEnv,
    chainId: resolvedChainID,
    nodeProtocolVersion: resolvedChainVersion,
    isNewProtocol,

    // optional
    // keyPathParameters: keyPathParametersForSdk,
    // devnet
    // ppNodeUrl: 'http://35.187.47.46',
    // ppNodePort: '8142',
    // ppNodeUrl: 'https://sds-dev-pp-8.thestratos.org',
    // ppNodePort: '',
    // mesos - we connect to mesos pp
    ppNodeUrl: 'http://34.195.137.237',
    ppNodePort: '8142',
  });

  const hdPathIndex = 0;

  const _cosmosClient = await stratos.chain.cosmos.cosmosService.create(zeroUserMnemonic, hdPathIndex);

  // Create a wallet and show accounts
  // const wallet = await stratos.chain.cosmos.cosmosWallet.createWalletAtPath(hdPathIndex, zeroUserMnemonic);
  // console.log('wallet', wallet);
  // const a = await wallet.getAccounts();
  // console.log('a', a);
  // await runFaucet(hdPathIndex, zeroUserMnemonic);
  // await mainSdsPrepay(hdPathIndex, zeroUserMnemonic);
  // 1 Check balance
  // await getBalanceCardMetrics(hdPathIndex, zeroUserMnemonic);
  // await getOzoneBalance(hdPathIndex, zeroUserMnemonic);
  // const hdPathIndexReceiver = 1;
  // await mainSend(hdPathIndex, zeroUserMnemonic, hdPathIndexReceiver);
  // 1a
  // await testRequestUserFileList(hdPathIndex, 0);
  // 2a - that is the file name - it has to be in ./src
  const filename = 'file10M_May_27_v1.bin';
  // await testItFileUpFromBuffer(hdPathIndex, filename);
  // 3a
  const filehash = 'v05j1m54m10sdhavr6tg8g2dmhng30712l9sisao';
  const filesize = 10000001;
  // filename: 'file10M_May_21_v1.bin',
  // await testFileDl(hdPathIndex, filename, filehash, filesize);
  // 4a
  // await testRequestUserSharedFileList(hdPathIndex, 0);
  // 5a
  // const filehash = 'v05j1m54m10sdhavr6tg8g2dmhng30712l9sisao';
  // await testRequestUserFileShare(hdPathIndex, filehash);
  // 6a
  // const shareid = '2d44dc5f3f8ac6b1';
  // await testRequestUserStopFileShare(hdPathIndex, shareid);
  // 7a
  const sharelink = 'ICDrUX_2d44dc5f3f8ac6b1';
  // await testRequestUserDownloadSharedFile(hdPathIndex, sharelink, filesize);
  // void testBalanceRound();
  // void testRedis();
  void testEnc();
}

void main();
