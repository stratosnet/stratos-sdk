"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnectionString = exports.fileDriveDataPrefix = exports.redisPort = exports.redisHost = exports.redisPwd = exports.redisUsr = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// eslint-disable-next-line @typescript-eslint/naming-convention
const { REDIS_USR = '', REDIS_PWD = '', REDIS_HOST = '', REDIS_PORT = '' } = process.env;
exports.redisUsr = REDIS_USR;
exports.redisPwd = REDIS_PWD;
exports.redisHost = REDIS_HOST;
exports.redisPort = REDIS_PORT;
exports.fileDriveDataPrefix = 'st_file_drive';
exports.redisConnectionString = `redis://${exports.redisUsr}:${exports.redisPwd}@${exports.redisHost}:${exports.redisPort}`;
//# sourceMappingURL=redis.js.map