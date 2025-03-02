import * as WalletTypes from '../../crypto/hdVault/hdVaultTypes';
import { networkTypes } from '../../network';
import * as SdsTypes from './types';
export declare const shareFile: (keypair: WalletTypes.KeyPairInfo, filehash: string, durationInDays?: number) => Promise<{
    filehash: string;
    sharelink: string;
    shareid: string;
}>;
export declare const stopFileSharing: (keypair: WalletTypes.KeyPairInfo, shareid: string) => Promise<boolean>;
export declare const getSharedFileList: (keypair: WalletTypes.KeyPairInfo, page?: number) => Promise<{
    files: networkTypes.SharedFileInfoItem[];
    totalnumber: number;
}>;
export declare const getAllSharedFileList: (keypair: WalletTypes.KeyPairInfo) => Promise<networkTypes.FileInfoItem[]>;
export declare const downloadSharedFileToBuffer: (keypair: WalletTypes.KeyPairInfo, sharelink: string, filesize: number, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<{
    downloadedFile: Buffer;
    originalFileName: string;
}>;
export declare const downloadSharedFile: (keypair: WalletTypes.KeyPairInfo, filePathToSave: string, sharelink: string, filesize: number, progressCb?: (data: SdsTypes.ProgressCbData) => void) => Promise<{
    filePathToSave: string;
}>;
export declare const getSharedFileInfo: (keypair: WalletTypes.KeyPairInfo, sharelink: string) => Promise<{
    requestGetSharedReturn: networkTypes.ReturnCodeType;
    filehash: string;
    originalFileName: string;
    filesize: number;
    requestReturnDetail: string;
}>;
