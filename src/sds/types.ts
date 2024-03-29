import { SimpleObject } from 'services/walletService';
import * as NetworkTypes from '../services/network/types';

export type ProgressCbData = SimpleObject & {
  result: SimpleObject & { message?: string; success: boolean; details?: SimpleObject; code: number };
  error?: SimpleObject & { message: string; details?: any };
};

export type RequestUserFilesResponse =
  NetworkTypes.FileUserRequestResult<NetworkTypes.FileUserRequestListResponse>;

export interface UserFileListResponse {
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
