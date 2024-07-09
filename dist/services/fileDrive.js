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
exports.getDataFromRedis = exports.sendDataToRedis = exports.getRedisClientInstance = exports.buildEncryptedDataEntity = exports.getSignedDataItemKey = exports.encryptGivedDataItem = exports.getDataItemKey = exports.getEncodingPassword = exports.decryptDataItem = exports.getSignedData = exports.verifyDataSignature = void 0;
const redis_1 = require("redis");
const cosmosUtils = __importStar(require("../chain/cosmos/cosmosUtils"));
const REDIS = __importStar(require("../config/redis"));
const hdVault = __importStar(require("../crypto/hdVault"));
const helpers_1 = require("./helpers");
const verifyDataSignature = async (derivedKeyPair, data, dataSignature) => {
    try {
        const res = await hdVault.keyUtils.verifySignatureInBase64(data, dataSignature, derivedKeyPair.publicKey);
        return res;
    }
    catch (err) {
        const msg = 'signature verification failed - ' + err.message;
        // eslint-disable-next-line no-console
        console.log(msg, err);
        return false;
    }
};
exports.verifyDataSignature = verifyDataSignature;
const getSignedData = async (derivedKeyPair, data) => {
    // 88 characters long base64 string (basically a signed message, to make sure the user in fact created that key)
    const encodedStAddressStringSignedBase64 = await hdVault.keyUtils.signWithPrivateKeyInBase64(data, derivedKeyPair.privateKey);
    try {
        // just in case verification of that signature
        await (0, exports.verifyDataSignature)(derivedKeyPair, data, encodedStAddressStringSignedBase64);
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.log('getDataKey throws an error - ', err);
        const msg = 'could not get data key - key sign verification failed - ' + err.message;
        throw Error(msg);
    }
    // so, the key here is created from the user address, which was used to get keccak hash (32bytes)
    // then those bytes were signed and converted to base64
    return encodedStAddressStringSignedBase64;
};
exports.getSignedData = getSignedData;
const decryptDataItem = async (encryptedEncodedData, password) => {
    var _a;
    const decodedFromBase64ToEncrypted = (0, helpers_1.base64StringToHumanString)(encryptedEncodedData);
    let decodedDecrypted;
    try {
        // Uint8Array of decrypted bytes
        decodedDecrypted = await cosmosUtils.decryptMasterKeySeed(password, decodedFromBase64ToEncrypted);
    }
    catch (error) {
        const msg = `Could not decrypt data with a given password. Error - ${(_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : error}`;
        throw Error(msg);
    }
    if (!decodedDecrypted) {
        const msg = 'Could not decrypt data with a given password. Decrypted data is empty';
        // eslint-disable-next-line no-console
        console.log(msg);
        throw Error(msg);
    }
    const decodedReadable = (0, helpers_1.uint8arrayToHumanString)(decodedDecrypted);
    const decodedOriginal = JSON.parse(decodedReadable);
    return decodedOriginal;
};
exports.decryptDataItem = decryptDataItem;
const getEncodingPassword = (derivedKeyPair) => {
    // keccak256 hash of the private key , it will give 32 bytes of hash to be used, to the whole pk will be used
    const passwordTestBytes = hdVault.keyUtils.encodeSignatureMessage(derivedKeyPair.privateKey);
    const passwordTest = (0, helpers_1.uint8arrayToBase64Str)(passwordTestBytes);
    return passwordTest;
};
exports.getEncodingPassword = getEncodingPassword;
const getDataItemKey = async (derivedKeyPair) => {
    // 32 bytes length
    const encodedStAddress = hdVault.keyUtils.encodeSignatureMessage(derivedKeyPair.address);
    const encodedStAddressStringBase64 = (0, helpers_1.uint8arrayToBase64Str)(encodedStAddress);
    // so, the key here is created from the user address, which was used to get keccak hash (32bytes)
    // then those bytes were converted to base64
    return encodedStAddressStringBase64;
};
exports.getDataItemKey = getDataItemKey;
const encryptGivedDataItem = (sampleData, password) => {
    const sampleDataBuff = Buffer.from(JSON.stringify(sampleData));
    const sampleDataBuffUint8 = Uint8Array.from(sampleDataBuff);
    // sampleDataJsonStringifiedEncrypted is an sjcl.SjclCipherEncrypted object
    // const sampleDataJsonStringifiedEncrypted = chain.cosmos.cosmosUtils.encryptMasterKeySeed(
    const sampleDataJsonStringifiedEncrypted = cosmosUtils.encryptMasterKeySeed(password, sampleDataBuffUint8);
    const sampleDataEncripytedEncoded = (0, helpers_1.humanStringToBase64String)(sampleDataJsonStringifiedEncrypted.toString());
    return sampleDataEncripytedEncoded;
};
exports.encryptGivedDataItem = encryptGivedDataItem;
const getSignedDataItemKey = async (derivedKeyPair) => {
    const dataKey = await (0, exports.getDataItemKey)(derivedKeyPair);
    return (0, exports.getSignedData)(derivedKeyPair, dataKey);
};
exports.getSignedDataItemKey = getSignedDataItemKey;
const buildEncryptedDataEntity = async (sampleData, derivedKeyPair) => {
    const signedDataKey = await (0, exports.getSignedDataItemKey)(derivedKeyPair);
    const password = (0, exports.getEncodingPassword)(derivedKeyPair);
    const sampleDataPrepared = (0, exports.encryptGivedDataItem)(sampleData, password);
    // 88 characters long base64 string (basically, data signature)
    const dataSig = await (0, exports.getSignedData)(derivedKeyPair, sampleDataPrepared);
    const resultToBeTransmitted = {
        key: signedDataKey,
        data: sampleDataPrepared,
        dataSig,
    };
    return resultToBeTransmitted;
};
exports.buildEncryptedDataEntity = buildEncryptedDataEntity;
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
async function getRedisClientInstance() {
    const redisUrl = REDIS.redisConnectionString;
    const redis = (0, redis_1.createClient)({ url: redisUrl });
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
exports.getRedisClientInstance = getRedisClientInstance;
const sendDataToRedis = async (derivedKeyPair, sampleData) => {
    if (!derivedKeyPair) {
        return;
    }
    const redis = await getRedisClientInstance();
    const redisDataEntity = await (0, exports.buildEncryptedDataEntity)(sampleData, derivedKeyPair);
    const res = await redis.hSet(REDIS.fileDriveDataPrefix, redisDataEntity.key, `${redisDataEntity.data}:${redisDataEntity.dataSig}`);
    await redis.disconnect();
    return res;
};
exports.sendDataToRedis = sendDataToRedis;
const getDataFromRedis = async (derivedKeyPair) => {
    if (!derivedKeyPair) {
        return;
    }
    const redis = await getRedisClientInstance();
    const signedDataKey = await (0, exports.getSignedDataItemKey)(derivedKeyPair);
    const userData = (await redis.hGet(REDIS.fileDriveDataPrefix, signedDataKey)) || '';
    await redis.disconnect();
    const [dataPortion, dataSig] = userData.split(':');
    const passwordTest = (0, exports.getEncodingPassword)(derivedKeyPair);
    const res = await (0, exports.verifyDataSignature)(derivedKeyPair, dataPortion, dataSig);
    if (!res) {
        // eslint-disable-next-line no-console
        console.log('!!!! SIGNATURE VERIFICATION HAS FAILED. Data might be compomised  !!!!!');
    }
    const decodedOriginal = await (0, exports.decryptDataItem)(dataPortion !== null && dataPortion !== void 0 ? dataPortion : '', passwordTest);
    return decodedOriginal;
};
exports.getDataFromRedis = getDataFromRedis;
//# sourceMappingURL=fileDrive.js.map