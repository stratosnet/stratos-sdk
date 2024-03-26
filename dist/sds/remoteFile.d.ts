/// <reference types="node" />
import { wallet } from '../hdVault';
import * as Network from '../services/network';
import { networkTypes } from '../services/network';
import * as NetworkTypes from '../services/network/types';
type RequestUserFilesResponse = networkTypes.FileUserRequestResult<networkTypes.FileUserRequestListResponse>;
interface UserFileListResponse {
    files: NetworkTypes.FileInfoItem[];
    originalResponse: RequestUserFilesResponse;
}
export interface UploadedFileStatusInfo {
    fileHash: string;
    fileUploadState: number;
    userHasFile: boolean;
    replicas: number;
    requestGetFileStatusReturn: string;
}
export declare const getUploadedFilesStatus: (keypair: wallet.KeyPairInfo, fileHash: string) => Promise<UploadedFileStatusInfo>;
export declare const getUploadedFileList: (keypair: wallet.KeyPairInfo, page?: number) => Promise<UserFileListResponse>;
export declare const downloadFile: (keypair: wallet.KeyPairInfo, filePathToSave: string, filehash: string, filesize: number) => Promise<{
    filePathToSave: string;
}>;
export declare const updloadFile: (keypair: wallet.KeyPairInfo, fileReadPath: string) => Promise<{
    uploadReturn: string;
    filehash: string;
    fileStatusInfo: UploadedFileStatusInfo;
}>;
export declare const updloadFileV1: (keypair: wallet.KeyPairInfo, fileReadPath: string) => Promise<{
    uploadReturn: string;
    filehash: string;
    fileStatusInfo: UploadedFileStatusInfo;
}>;
export declare const updloadFileFromBuffer: (keypair: wallet.KeyPairInfo, fileBuffer: Buffer, imageFileName: string, fileHash: string, fileSize: number) => Promise<{
    uploadReturn: string;
    filehash: string;
    fileStatusInfo: UploadedFileStatusInfo;
}>;
export declare const shareFile: (keypair: wallet.KeyPairInfo, filehash: string) => Promise<{
    filehash: string;
    sharelink: string;
    shareid: string;
}>;
export declare const stopFileSharing: (keypair: wallet.KeyPairInfo, shareid: string) => Promise<boolean>;
export declare const getSharedFileList: (keypair: wallet.KeyPairInfo, page?: number) => Promise<{
    files: Network.networkTypes.SharedFileInfoItem[];
    totalnumber: number;
}>;
export declare const downloadSharedFile: (keypair: wallet.KeyPairInfo, filePathToSave: string, sharelink: string, filesize: number) => Promise<void>;
export {};
