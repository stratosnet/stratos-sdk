/// <reference types="node" />
import { wallet } from '../hdVault';
import * as NetworkTypes from '../services/network/types';
import * as SdsTypes from './types';
export declare const UPLOAD_CODES: {
    GET_FILE_STATUS: number;
    GET_FILE_STATUS_NO_RESPONSE: number;
    GET_FILE_STATUS_NOT_NUMBER: number;
    USER_REQUEST_UPLOAD_ERROR: number;
    USER_REQUEST_UPLOAD_FILE_ALREADY_SENT: number;
    USER_REQUEST_UPLOAD_NO_OFFSET_END: number;
    USER_REQUEST_UPLOAD_NO_OFFSET_START: number;
    USER_UPLOAD_DATA_REQUEST_SENT: number;
    USER_UPLOAD_DATA_PROCESS_STOPPED: number;
    USER_UPLOAD_DATA_PROCESS_STOP_FAIL: number;
    USER_UPLOAD_DATA_NO_FILE_CHUNK: number;
    USER_UPLOAD_DATA_FILE_CHUNK_CORRECT: number;
    USER_UPLOAD_DATA_NO_RESPONSE: number;
    USER_UPLOAD_DATA_NO_ID_IN_RESPONSE: number;
    USER_UPLOAD_DATA_RESPONSE_CORRECT: number;
    USER_UPLOAD_DATA_NO_OFFSET_END: number;
    USER_UPLOAD_DATA_NO_OFFSET_START: number;
    USER_UPLOAD_DATA_COMPLETED: number;
    USER_UPLOAD_DATA_NO_CONTINUE: number;
    USER_UPLOAD_DATA_FINISHED: number;
};
export declare const getUploadedFilesStatus: (keypair: wallet.KeyPairInfo, fileHash: string, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<SdsTypes.UploadedFileStatusInfo>;
export declare const getUploadedFileList: (keypair: wallet.KeyPairInfo, page?: number) => Promise<SdsTypes.UserFileListResponse>;
export declare const downloadFile: (keypair: wallet.KeyPairInfo, filePathToSave: string, filehash: string, filesize: number) => Promise<{
    filePathToSave: string;
}>;
export declare const updloadFile: (keypair: wallet.KeyPairInfo, fileReadPath: string) => Promise<{
    uploadReturn: string;
    filehash: string;
    fileStatusInfo: SdsTypes.UploadedFileStatusInfo;
}>;
export declare const updloadFileFromBuffer: (keypair: wallet.KeyPairInfo, fileBuffer: Buffer, resolvedFileName: string, fileHash: string, fileSize: number, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<{
    uploadReturn: string;
    filehash: string;
    fileStatusInfo: SdsTypes.UploadedFileStatusInfo;
}>;
export declare const shareFile: (keypair: wallet.KeyPairInfo, filehash: string) => Promise<{
    filehash: string;
    sharelink: string;
    shareid: string;
}>;
export declare const stopFileSharing: (keypair: wallet.KeyPairInfo, shareid: string) => Promise<boolean>;
export declare const getSharedFileList: (keypair: wallet.KeyPairInfo, page?: number) => Promise<{
    files: NetworkTypes.SharedFileInfoItem[];
    totalnumber: number;
}>;
export declare const downloadSharedFile: (keypair: wallet.KeyPairInfo, filePathToSave: string, sharelink: string, filesize: number) => Promise<void>;
