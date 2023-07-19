import { wallet } from '../hdVault';
import * as Network from '../services/network';
import { networkTypes } from '../services/network';
import { FileInfoItem } from '../services/network/types';
type RequestUserFilesResponse = networkTypes.FileUserRequestResult<networkTypes.FileUserRequestListResponse>;
interface UserFileListResponse {
    files: FileInfoItem[];
    originalResponse: RequestUserFilesResponse;
}
export declare const getUploadedFileList: (keypair: wallet.KeyPairInfo, page?: number) => Promise<UserFileListResponse>;
export declare const downloadFile: (keypair: wallet.KeyPairInfo, filePathToSave: string, filehash: string) => Promise<{
    filePathToSave: string;
}>;
export declare const updloadFile: (keypair: wallet.KeyPairInfo, fileReadPath: string) => Promise<{
    uploadReturn: string;
    filehash: string;
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
export declare const downloadSharedFile: (keypair: wallet.KeyPairInfo, filePathToSave: string, sharelink: string) => Promise<void>;
export {};
