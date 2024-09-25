import { network } from '@stratos-network/stratos-sdk.js';
import axios from 'axios';
import JSONbig from 'json-bigint';
import Sdk from '../Sdk';
import * as Types from './networkTypes';

const _axios = axios.create({});

_axios.defaults.transformResponse = [
  data => {
    try {
      return JSONbig({ useNativeBigInt: true }).parse(data);
    } catch (_) {
      return data;
    }
  },
];

const getRestRedisRoute = (): string => {
  const { restRedisUrl } = Sdk.environment;

  return restRedisUrl || 'http://localhost:8080';
};

const getGatewayToken = (): string => {
  const { gatewayToken } = Sdk.environment;

  if (!gatewayToken) return '';

  return `?token=${gatewayToken.trim()}`;
};

export const getFilesDataFromRedis = async (
  dataKey: string,
  keyPrefix: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.GetDataFromRedisResult> => {
  // const url = `${getRestRedisRoute()}/api/get_key_value`;
  const url = `${getRestRedisRoute()}/redis-rest-api/get_key_value${getGatewayToken()}`;

  console.log('given keyPrefix for get', keyPrefix);
  console.log('getFilesDataFromRedis url', url);

  const payload = {
    data_key: dataKey,
  };

  const dataResult = await network.networkApi.apiPost(url, payload, config);

  return dataResult;
};

export const setFilesDataToRedis = async (
  dataKey: string,
  dataValue: string,
  keyPrefix: string,
  config?: Types.NetworkAxiosConfig,
): Promise<Types.SetDataToRedisResult> => {
  // const url = `${getRestRedisRoute()}/api/set_key_value`;
  const url = `${getRestRedisRoute()}/redis-rest-api/set_key_value${getGatewayToken()}`;

  console.log('given keyPrefix for set', keyPrefix);

  const payload = {
    data_key: dataKey,
    data_value: dataValue,
  };

  const dataResult = await network.networkApi.apiPost(url, payload, config);

  return dataResult;
};
