import { SimpleObject } from '../../common/types/common';
import * as NetworkTypes from '../../network/networkTypes';

export type ProgressCbData = SimpleObject & {
  result: SimpleObject & { message?: string; success: boolean; details?: SimpleObject; code: number };
  error?: SimpleObject & { message: string; details?: any };
};

export type RequestUserFilesResponse =
  NetworkTypes.FileUserRequestResult<NetworkTypes.FileUserRequestListResponse>;

export interface UserFileListResponse {
  files: NetworkTypes.FileInfoItem[];
  // originalResponse: RequestUserFilesResponse;
  originalResponse: NetworkTypes.FileUserRequestListResponse;
}

export interface UploadedFileStatusInfo {
  fileHash: string;
  fileUploadState: number;
  userHasFile: boolean;
  replicas: number;
  requestGetFileStatusReturn: string;
}

export const DOWNLOAD_CODES = {
  NO_RESPONSE_TO_DOWNLOAD_REQUEST: 1,
  RETURN_FIELD_OF_REQUEST_DOWNLOAD_HAS_ERROR: 2,
  UNEXPECTED_CODE_IN_RETURN_FIELD_OF_REQUEST_DOWNLOAD: 3,
  REQUIRED_REQID_IS_MISSING_IN_THE_RESPONSE: 4,
  NO_OFFSET_ERROR_A: 5,
  NO_OFFSET_ERROR_B: 6,
  COULD_NOT_GET_DOWNLOAD_CONFIRMATION: 7,
  WE_HAVE_CORRECT_RESPONSE_TO_REQUEST_DOWNLOAD: 8,
  PROCESS_USER_FILE_DOWNLOAD: 10,
  COULD_NOT_PROCESS_DOWNLOAD_TO_BUFFER: 20,
};

export const UPLOAD_CODES = {
  GET_FILE_STATUS: 1,
  GET_FILE_STATUS_NO_RESPONSE: 2,
  GET_FILE_STATUS_NOT_NUMBER: 3,
  USER_REQUEST_UPLOAD_ERROR: 4,
  USER_REQUEST_UPLOAD_FILE_ALREADY_SENT: 5,
  USER_REQUEST_UPLOAD_NO_OFFSET_END: 6,
  USER_REQUEST_UPLOAD_NO_OFFSET_START: 7,
  USER_UPLOAD_DATA_REQUEST_SENT: 8,
  USER_UPLOAD_DATA_PROCESS_STOPPED: 9,
  USER_UPLOAD_DATA_PROCESS_STOP_FAIL: 10,
  USER_UPLOAD_DATA_NO_FILE_CHUNK: 11,
  USER_UPLOAD_DATA_FILE_CHUNK_CORRECT: 12,
  USER_UPLOAD_DATA_NO_RESPONSE: 13,
  USER_UPLOAD_DATA_NO_ID_IN_RESPONSE: 14,
  USER_UPLOAD_DATA_RESPONSE_CORRECT: 15,
  USER_UPLOAD_DATA_NO_OFFSET_END: 16,
  USER_UPLOAD_DATA_NO_OFFSET_START: 17,
  USER_UPLOAD_DATA_COMPLETED: 18,
  USER_UPLOAD_DATA_NO_CONTINUE: 19,
  USER_UPLOAD_DATA_FINISHED: 20,
};
