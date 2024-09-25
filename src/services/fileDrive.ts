import { chain, crypto } from '@stratos-network/stratos-sdk.js';
import * as REDIS from '../config/redis';
import { networkApi } from '../network';
import {
  uint8arrayToBase64Str,
  humanStringToBase64String,
  base64StringToHumanString,
  uint8arrayToHumanString,
} from './helpers';

type KeyPairInfo = crypto.hdVault.hdVaultTypes.KeyPairInfo;

export const verifyDataSignature = async (
  derivedKeyPair: KeyPairInfo,
  data: string,
  dataSignature: string,
): Promise<boolean> => {
  try {
    const res = await crypto.hdVault.keyUtils.verifySignatureInBase64(
      data,
      dataSignature,
      derivedKeyPair.publicKey,
    );
    return res;
  } catch (err) {
    const msg = 'signature verification failed - ' + (err as Error).message;
    // eslint-disable-next-line no-console
    console.log(msg, err);
    return false;
  }
};

export const getSignedData = async (derivedKeyPair: KeyPairInfo, data: string): Promise<string> => {
  // 88 characters long base64 string (basically a signed message, to make sure the user in fact created that key)
  const encodedStAddressStringSignedBase64 = await crypto.hdVault.keyUtils.signWithPrivateKeyInBase64(
    data,
    derivedKeyPair.privateKey,
  );

  try {
    // just in case verification of that signature
    await verifyDataSignature(derivedKeyPair, data, encodedStAddressStringSignedBase64);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('getDataKey throws an error - ', err);
    const msg = 'could not get data key - key sign verification failed - ' + (err as Error).message;
    throw Error(msg);
  }
  // so, the key here is created from the user address, which was used to get keccak hash (32bytes)
  // then those bytes were signed and converted to base64
  return encodedStAddressStringSignedBase64;
};

export const decryptDataItem = async (encryptedEncodedData: string, password: string): Promise<unknown> => {
  const decodedFromBase64ToEncrypted = base64StringToHumanString(encryptedEncodedData);

  let decodedDecrypted;

  try {
    // Uint8Array of decrypted bytes
    decodedDecrypted = await chain.cosmos.cosmosUtils.decryptMasterKeySeed(
      password,
      decodedFromBase64ToEncrypted,
    );
  } catch (error) {
    const msg = `Could not decrypt data with a given password. Error - ${(error as Error)?.message ?? error}`;
    throw Error(msg);
  }

  if (!decodedDecrypted) {
    const msg = 'Could not decrypt data with a given password. Decrypted data is empty';
    // eslint-disable-next-line no-console
    console.log(msg);
    throw Error(msg);
  }

  const decodedReadable = uint8arrayToHumanString(decodedDecrypted);

  const decodedOriginal = JSON.parse(decodedReadable);

  return decodedOriginal;
};

export const getEncodingPassword = (derivedKeyPair: KeyPairInfo): string => {
  // keccak256 hash of the private key , it will give 32 bytes of hash to be used, to the whole pk will be used
  const passwordTestBytes = crypto.hdVault.keyUtils.encodeSignatureMessage(derivedKeyPair.privateKey);

  const passwordTest = uint8arrayToBase64Str(passwordTestBytes);

  return passwordTest;
};

export const getDataItemKey = async (derivedKeyPair: KeyPairInfo): Promise<string> => {
  // 32 bytes length
  const encodedStAddress = crypto.hdVault.keyUtils.encodeSignatureMessage(derivedKeyPair.address);

  const encodedStAddressStringBase64 = uint8arrayToBase64Str(encodedStAddress);

  // so, the key here is created from the user address, which was used to get keccak hash (32bytes)
  // then those bytes were converted to base64
  return encodedStAddressStringBase64;
};

export const encryptGivedDataItem = <T>(sampleData: T, password: string): string => {
  const sampleDataBuff = Buffer.from(JSON.stringify(sampleData));

  const sampleDataBuffUint8 = Uint8Array.from(sampleDataBuff);

  // sampleDataJsonStringifiedEncrypted is an sjcl.SjclCipherEncrypted object
  // const sampleDataJsonStringifiedEncrypted = chain.cosmos.cosmosUtils.encryptMasterKeySeed(
  const sampleDataJsonStringifiedEncrypted = chain.cosmos.cosmosUtils.encryptMasterKeySeed(
    password,
    sampleDataBuffUint8,
  );

  const sampleDataEncripytedEncoded = humanStringToBase64String(
    sampleDataJsonStringifiedEncrypted.toString(),
  );

  return sampleDataEncripytedEncoded;
};

export const getSignedDataItemKey = async (derivedKeyPair: KeyPairInfo): Promise<string> => {
  const dataKey = await getDataItemKey(derivedKeyPair);

  return getSignedData(derivedKeyPair, dataKey);
};

export const buildEncryptedDataEntity = async <T>(
  sampleData: T,
  derivedKeyPair: KeyPairInfo,
): Promise<{ key: string; data: string; dataSig: string }> => {
  const signedDataKey = await getSignedDataItemKey(derivedKeyPair);

  const password = getEncodingPassword(derivedKeyPair);

  const sampleDataPrepared = encryptGivedDataItem(sampleData, password);

  // 88 characters long base64 string (basically, data signature)
  const dataSig = await getSignedData(derivedKeyPair, sampleDataPrepared);

  const resultToBeTransmitted = {
    key: signedDataKey,
    data: sampleDataPrepared,
    dataSig,
  };

  return resultToBeTransmitted;
};

export const sendDataToRedis = async <T>(
  derivedKeyPair: KeyPairInfo,
  sampleData: T,
): Promise<string | undefined> => {
  if (!derivedKeyPair) {
    return;
  }

  const redisDataEntity = await buildEncryptedDataEntity(sampleData, derivedKeyPair);

  const res = await networkApi.setFilesDataToRedis(
    redisDataEntity.key,
    `${redisDataEntity.data}:${redisDataEntity.dataSig}`,
    REDIS.fileDriveDataPrefix,
  );

  if (res.error) {
    throw Error('could not set data to Redis. Error is - ' + JSON.stringify(res.error));
  }

  if (!res.response) {
    throw Error('could not set data to Redis. No response in the result');
  }

  const { response } = res;

  const [redisResponse] = response;

  return redisResponse;
};

export const getDataFromRedis = async (derivedKeyPair: KeyPairInfo): Promise<unknown> => {
  if (!derivedKeyPair) {
    return;
  }

  const signedDataKey = await getSignedDataItemKey(derivedKeyPair);

  const res = await networkApi.getFilesDataFromRedis(signedDataKey, REDIS.fileDriveDataPrefix);

  if (res.error) {
    throw Error('could not get data from Redis. Error is - ' + JSON.stringify(res.error));
  }

  if (!res.response) {
    throw Error('could not get data from Redis. No response in the result');
  }

  const { response } = res;

  const [userData] = response;

  if (userData === 'error') {
    throw Error('Response from Redis has an error. Data with this key might not be yet set');
  }

  const [dataPortion, dataSig] = userData.split(':');

  const passwordTest = getEncodingPassword(derivedKeyPair);

  const result = await verifyDataSignature(derivedKeyPair, dataPortion, dataSig);

  if (!result) {
    console.log('!!!! SIGNATURE VERIFICATION HAS FAILED. Data might be compomised  !!!!!');
  }

  const decodedOriginal = await decryptDataItem(dataPortion ?? '', passwordTest);

  return decodedOriginal;
};
