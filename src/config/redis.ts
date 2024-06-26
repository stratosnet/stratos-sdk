import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line @typescript-eslint/naming-convention
const { REDIS_USR = '', REDIS_PWD = '', REDIS_HOST = '', REDIS_PORT = '' } = process.env;

export const redisUsr = REDIS_USR;
export const redisPwd = REDIS_PWD;
export const redisHost = REDIS_HOST;
export const redisPort = REDIS_PORT;

export const fileDriveDataPrefix = 'st_file_drive';

export const redisConnectionString = `redis://${redisUsr}:${redisPwd}@${redisHost}:${redisPort}`;
