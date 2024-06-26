import { type KeyPairInfo } from 'crypto/hdVault/hdVaultTypes';
import { createClient } from 'redis';
import * as REDIS from '../config/redis';
import * as stratos from '../index';
import {
  uint8arrayToBase64Str,
  humanStringToBase64String,
  base64StringToHumanString,
  uint8arrayToHumanString,
} from './helpers';

export const verifyDataSignature = async (
  derivedKeyPair: KeyPairInfo,
  data: string,
  dataSignature: string,
): Promise<boolean> => {
  try {
    const res = await stratos.crypto.hdVault.keyUtils.verifySignatureInBase64(
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
  const encodedStAddressStringSignedBase64 = await stratos.crypto.hdVault.keyUtils.signWithPrivateKeyInBase64(
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
    decodedDecrypted = await stratos.chain.cosmos.cosmosUtils.decryptMasterKeySeed(
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
  const passwordTestBytes = stratos.crypto.hdVault.keyUtils.encodeSignatureMessage(derivedKeyPair.privateKey);

  const passwordTest = uint8arrayToBase64Str(passwordTestBytes);

  return passwordTest;
};

export const getDataItemKey = async (derivedKeyPair: KeyPairInfo): Promise<string> => {
  // 32 bytes length
  const encodedStAddress = stratos.crypto.hdVault.keyUtils.encodeSignatureMessage(derivedKeyPair.address);

  const encodedStAddressStringBase64 = uint8arrayToBase64Str(encodedStAddress);

  // so, the key here is created from the user address, which was used to get keccak hash (32bytes)
  // then those bytes were converted to base64
  return encodedStAddressStringBase64;
};

export const encryptGivedDataItem = <T>(sampleData: T, password: string): string => {
  const sampleDataBuff = Buffer.from(JSON.stringify(sampleData));

  const sampleDataBuffUint8 = Uint8Array.from(sampleDataBuff);

  // sampleDataJsonStringifiedEncrypted is an sjcl.SjclCipherEncrypted object
  const sampleDataJsonStringifiedEncrypted = stratos.chain.cosmos.cosmosUtils.encryptMasterKeySeed(
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function getRedisClientInstance() {
  const redisUrl = REDIS.redisConnectionString;
  const redis = createClient({ url: redisUrl });

  redis.on('error', err => {
    // eslint-disable-next-line no-console
    console.log('ERROR - Redis Client Error', err);
    throw Error(`Redis Client Error - ${err.message} `);
  });

  await redis.connect();

  const aString = await redis.ping(); // 'PONG'
  // eslint-disable-next-line no-console
  console.log('aString', aString);
  return redis;

  // await redis.flushDb();
  // await redis.flushAll();
}

export const sendDataToRedis = async <T>(
  derivedKeyPair: KeyPairInfo,
  sampleData: T,
): Promise<number | undefined> => {
  if (!derivedKeyPair) {
    return;
  }

  const redis = await getRedisClientInstance();

  const redisDataEntity = await buildEncryptedDataEntity(sampleData, derivedKeyPair);

  const res = await redis.hSet(
    REDIS.fileDriveDataPrefix,
    redisDataEntity.key,
    `${redisDataEntity.data}:${redisDataEntity.dataSig}`,
  );

  await redis.disconnect();

  return res;
};

export const getDataFromRedis = async (derivedKeyPair: KeyPairInfo): Promise<unknown> => {
  if (!derivedKeyPair) {
    return;
  }

  const redis = await getRedisClientInstance();
  const signedDataKey = await getSignedDataItemKey(derivedKeyPair);

  const userData = (await redis.hGet(REDIS.fileDriveDataPrefix, signedDataKey)) || '';

  await redis.disconnect();

  const [dataPortion, dataSig] = userData.split(':');

  const passwordTest = getEncodingPassword(derivedKeyPair);

  const res = await verifyDataSignature(derivedKeyPair, dataPortion, dataSig);

  if (!res) {
    // eslint-disable-next-line no-console
    console.log('!!!! SIGNATURE VERIFICATION HAS FAILED. Data might be compomised  !!!!!');
  }

  const decodedOriginal = await decryptDataItem(dataPortion ?? '', passwordTest);

  return decodedOriginal;
};
