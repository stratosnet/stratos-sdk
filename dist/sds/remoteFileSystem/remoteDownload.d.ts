import * as WalletTypes from '../../crypto/hdVault/hdVaultTypes';
import { networkTypes } from '../../network';
import * as SdsTypes from './types';
export declare const processUsedFileDownload: <T extends networkTypes.FileUserRequestDownloadResponse>(responseRequestDownloadShared: T, filehash: string, filesize: number, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<Buffer | undefined>;
export declare const downloadFileOriginal: (keypair: WalletTypes.KeyPairInfo, filePathToSave: string, filehash: string, filesize: number) => Promise<{
    filePathToSave: string;
}>;
export declare const downloadFileToBuffer: (keypair: WalletTypes.KeyPairInfo, filehash: string, filesize: number, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<{
    downloadedFile: Buffer;
}>;
export declare const downloadFile: (keypair: WalletTypes.KeyPairInfo, filePathToSave: string, filehash: string, filesize: number, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<{
    filePathToSave: string;
}>;
export declare const deleteFile: (keypair: WalletTypes.KeyPairInfo, filehash: string, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<{
    fileDeleteReturnCode: string;
    filehash: string;
}>;
