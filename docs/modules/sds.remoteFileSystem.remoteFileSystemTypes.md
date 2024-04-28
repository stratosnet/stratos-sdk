[Stratos SDK](../README.md) / [Exports](../modules.md) / [sds](sds.md) / [remoteFileSystem](sds.remoteFileSystem.md) / remoteFileSystemTypes

# Namespace: remoteFileSystemTypes

[sds](sds.md).[remoteFileSystem](sds.remoteFileSystem.md).remoteFileSystemTypes

## Table of contents

### Interfaces

- [UploadedFileStatusInfo](../interfaces/sds.remoteFileSystem.remoteFileSystemTypes.UploadedFileStatusInfo.md)
- [UserFileListResponse](../interfaces/sds.remoteFileSystem.remoteFileSystemTypes.UserFileListResponse.md)

### Type Aliases

- [ProgressCbData](sds.remoteFileSystem.remoteFileSystemTypes.md#progresscbdata)
- [RequestUserFilesResponse](sds.remoteFileSystem.remoteFileSystemTypes.md#requestuserfilesresponse)

### Variables

- [UPLOAD\_CODES](sds.remoteFileSystem.remoteFileSystemTypes.md#upload_codes)

## Type Aliases

### ProgressCbData

Ƭ **ProgressCbData**: `SimpleObject` & \{ `error?`: `SimpleObject` & \{ `details?`: `any` ; `message`: `string`  } ; `result`: `SimpleObject` & \{ `code`: `number` ; `details?`: `SimpleObject` ; `message?`: `string` ; `success`: `boolean`  }  }

#### Defined in

sds/remoteFileSystem/types.ts:4

___

### RequestUserFilesResponse

Ƭ **RequestUserFilesResponse**: [`FileUserRequestResult`](../interfaces/network.networkTypes.FileUserRequestResult.md)\<[`FileUserRequestListResponse`](../interfaces/network.networkTypes.FileUserRequestListResponse.md)\>

#### Defined in

sds/remoteFileSystem/types.ts:9

## Variables

### UPLOAD\_CODES

• `Const` **UPLOAD\_CODES**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `GET_FILE_STATUS` | `number` |
| `GET_FILE_STATUS_NOT_NUMBER` | `number` |
| `GET_FILE_STATUS_NO_RESPONSE` | `number` |
| `USER_REQUEST_UPLOAD_ERROR` | `number` |
| `USER_REQUEST_UPLOAD_FILE_ALREADY_SENT` | `number` |
| `USER_REQUEST_UPLOAD_NO_OFFSET_END` | `number` |
| `USER_REQUEST_UPLOAD_NO_OFFSET_START` | `number` |
| `USER_UPLOAD_DATA_COMPLETED` | `number` |
| `USER_UPLOAD_DATA_FILE_CHUNK_CORRECT` | `number` |
| `USER_UPLOAD_DATA_FINISHED` | `number` |
| `USER_UPLOAD_DATA_NO_CONTINUE` | `number` |
| `USER_UPLOAD_DATA_NO_FILE_CHUNK` | `number` |
| `USER_UPLOAD_DATA_NO_ID_IN_RESPONSE` | `number` |
| `USER_UPLOAD_DATA_NO_OFFSET_END` | `number` |
| `USER_UPLOAD_DATA_NO_OFFSET_START` | `number` |
| `USER_UPLOAD_DATA_NO_RESPONSE` | `number` |
| `USER_UPLOAD_DATA_PROCESS_STOPPED` | `number` |
| `USER_UPLOAD_DATA_PROCESS_STOP_FAIL` | `number` |
| `USER_UPLOAD_DATA_REQUEST_SENT` | `number` |
| `USER_UPLOAD_DATA_RESPONSE_CORRECT` | `number` |

#### Defined in

sds/remoteFileSystem/types.ts:25
