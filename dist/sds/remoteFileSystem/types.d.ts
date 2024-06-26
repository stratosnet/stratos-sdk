import { SimpleObject } from '../../common/types/common';
import * as NetworkTypes from '../../network/networkTypes';
export type ProgressCbData = SimpleObject & {
    result: SimpleObject & {
        message?: string;
        success: boolean;
        details?: SimpleObject;
        code: number;
    };
    error?: SimpleObject & {
        message: string;
        details?: any;
    };
};
export type RequestUserFilesResponse = NetworkTypes.FileUserRequestResult<NetworkTypes.FileUserRequestListResponse>;
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
