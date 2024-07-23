/// <reference types="node" />
import * as WalletTypes from '../../crypto/hdVault/hdVaultTypes';
import { networkTypes } from '../../network';
import * as SdsTypes from './types';
export declare const getUploadedFilesStatus: (keypair: WalletTypes.KeyPairInfo, fileHash: string, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<SdsTypes.UploadedFileStatusInfo>;
export declare const getUploadedFileList: (keypair: WalletTypes.KeyPairInfo, page?: number) => Promise<SdsTypes.UserFileListResponse>;
export declare const getAllUploadedFileList: (keypair: WalletTypes.KeyPairInfo) => Promise<networkTypes.FileInfoItem[]>;
export declare const downloadFileOriginal: (keypair: WalletTypes.KeyPairInfo, filePathToSave: string, filehash: string, filesize: number) => Promise<{
    filePathToSave: string;
}>;
export declare const downloadFileToBuffer: (keypair: WalletTypes.KeyPairInfo, filehash: string, filesize: number, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<{
    downloadedFile: Buffer;
}>;
export declare const downloadFile: (keypair: WalletTypes.KeyPairInfo, filePathToSave: string, filehash: string, filesize: number, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<{
    filePathToSave: string;
}>;
export declare const updloadFile: (keypair: WalletTypes.KeyPairInfo, fileReadPath: string) => Promise<{
    uploadReturn: string;
    filehash: string;
    fileStatusInfo: SdsTypes.UploadedFileStatusInfo;
}>;
export declare const updloadFileFromBuffer: (keypair: WalletTypes.KeyPairInfo, fileBuffer: Buffer, resolvedFileName: string, fileHash: string, fileSize: number, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<{
    uploadReturn: string;
    filehash: string;
    fileStatusInfo: SdsTypes.UploadedFileStatusInfo;
}>;
export declare const shareFile: (keypair: WalletTypes.KeyPairInfo, filehash: string) => Promise<{
    filehash: string;
    sharelink: string;
    shareid: string;
}>;
export declare const stopFileSharing: (keypair: WalletTypes.KeyPairInfo, shareid: string) => Promise<boolean>;
export declare const getSharedFileList: (keypair: WalletTypes.KeyPairInfo, page?: number) => Promise<{
    files: networkTypes.SharedFileInfoItem[];
    totalnumber: number;
}>;
export declare const downloadSharedFile: (keypair: WalletTypes.KeyPairInfo, filePathToSave: string, sharelink: string, filesize: number) => Promise<{
    filePathToSave: string;
}>;
