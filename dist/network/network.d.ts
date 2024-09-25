import * as Types from './networkTypes';
export declare const getFilesDataFromRedis: (dataKey: string, keyPrefix: string, config?: Types.NetworkAxiosConfig) => Promise<Types.GetDataFromRedisResult>;
export declare const setFilesDataToRedis: (dataKey: string, dataValue: string, keyPrefix: string, config?: Types.NetworkAxiosConfig) => Promise<Types.SetDataToRedisResult>;
