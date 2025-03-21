import * as WalletTypes from '../../crypto/hdVault/hdVaultTypes';
import { networkTypes } from '../../network';
import * as SdsTypes from './types';
export declare const getUploadedFilesStatus: (keypair: WalletTypes.KeyPairInfo, fileHash: string, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<SdsTypes.UploadedFileStatusInfo>;
export declare const getUploadedFileList: (keypair: WalletTypes.KeyPairInfo, page?: number) => Promise<SdsTypes.UserFileListResponse>;
export declare const getAllUploadedFileList: (keypair: WalletTypes.KeyPairInfo) => Promise<networkTypes.FileInfoItem[]>;
export declare const updloadFileFromBuffer: (keypair: WalletTypes.KeyPairInfo, fileBuffer: Buffer, resolvedFileName: string, fileHash: string, fileSize: number, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<{
    uploadReturn: string;
    filehash: string;
    fileStatusInfo: SdsTypes.UploadedFileStatusInfo;
}>;
export declare const updloadFile: (keypair: WalletTypes.KeyPairInfo, fileReadPath: string) => Promise<{
    uploadReturn: string;
    filehash: string;
    fileStatusInfo: SdsTypes.UploadedFileStatusInfo;
}>;
