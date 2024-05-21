[Stratos SDK](../README.md) / [Exports](../modules.md) / [sds](sds.md) / [remoteFileSystem](sds.remoteFileSystem.md) / remoteFileSystemApi

# Namespace: remoteFileSystemApi

[sds](sds.md).[remoteFileSystem](sds.remoteFileSystem.md).remoteFileSystemApi

## Table of contents

### Functions

- [downloadFile](sds.remoteFileSystem.remoteFileSystemApi.md#downloadfile)
- [downloadSharedFile](sds.remoteFileSystem.remoteFileSystemApi.md#downloadsharedfile)
- [getSharedFileList](sds.remoteFileSystem.remoteFileSystemApi.md#getsharedfilelist)
- [getUploadedFileList](sds.remoteFileSystem.remoteFileSystemApi.md#getuploadedfilelist)
- [getUploadedFilesStatus](sds.remoteFileSystem.remoteFileSystemApi.md#getuploadedfilesstatus)
- [shareFile](sds.remoteFileSystem.remoteFileSystemApi.md#sharefile)
- [stopFileSharing](sds.remoteFileSystem.remoteFileSystemApi.md#stopfilesharing)
- [updloadFile](sds.remoteFileSystem.remoteFileSystemApi.md#updloadfile)
- [updloadFileFromBuffer](sds.remoteFileSystem.remoteFileSystemApi.md#updloadfilefrombuffer)

## Functions

### downloadFile

▸ **downloadFile**(`keypair`, `filePathToSave`, `filehash`, `filesize`): `Promise`\<\{ `filePathToSave`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) |
| `filePathToSave` | `string` |
| `filehash` | `string` |
| `filesize` | `number` |

#### Returns

`Promise`\<\{ `filePathToSave`: `string`  }\>

#### Defined in

sds/remoteFileSystem/remoteFileSystem.ts:294

___

### downloadSharedFile

▸ **downloadSharedFile**(`keypair`, `filePathToSave`, `sharelink`, `filesize`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) |
| `filePathToSave` | `string` |
| `sharelink` | `string` |
| `filesize` | `number` |

#### Returns

`Promise`\<`void`\>

#### Defined in

sds/remoteFileSystem/remoteFileSystem.ts:1010

___

### getSharedFileList

▸ **getSharedFileList**(`keypair`, `page?`): `Promise`\<\{ `files`: [`SharedFileInfoItem`](../interfaces/network.networkTypes.SharedFileInfoItem.md)[] ; `totalnumber`: `number`  }\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) | `undefined` |
| `page` | `number` | `0` |

#### Returns

`Promise`\<\{ `files`: [`SharedFileInfoItem`](../interfaces/network.networkTypes.SharedFileInfoItem.md)[] ; `totalnumber`: `number`  }\>

#### Defined in

sds/remoteFileSystem/remoteFileSystem.ts:951

___

### getUploadedFileList

▸ **getUploadedFileList**(`keypair`, `page?`): `Promise`\<[`UserFileListResponse`](../interfaces/sds.remoteFileSystem.remoteFileSystemTypes.UserFileListResponse.md)\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) | `undefined` |
| `page` | `number` | `0` |

#### Returns

`Promise`\<[`UserFileListResponse`](../interfaces/sds.remoteFileSystem.remoteFileSystemTypes.UserFileListResponse.md)\>

#### Defined in

sds/remoteFileSystem/remoteFileSystem.ts:255

___

### getUploadedFilesStatus

▸ **getUploadedFilesStatus**(`keypair`, `fileHash`, `progressCb?`): `Promise`\<[`UploadedFileStatusInfo`](../interfaces/sds.remoteFileSystem.remoteFileSystemTypes.UploadedFileStatusInfo.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) |
| `fileHash` | `string` |
| `progressCb` | (`data`: [`ProgressCbData`](sds.remoteFileSystem.remoteFileSystemTypes.md#progresscbdata)) => `void` |

#### Returns

`Promise`\<[`UploadedFileStatusInfo`](../interfaces/sds.remoteFileSystem.remoteFileSystemTypes.UploadedFileStatusInfo.md)\>

#### Defined in

sds/remoteFileSystem/remoteFileSystem.ts:163

___

### shareFile

▸ **shareFile**(`keypair`, `filehash`): `Promise`\<\{ `filehash`: `string` ; `shareid`: `string` ; `sharelink`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) |
| `filehash` | `string` |

#### Returns

`Promise`\<\{ `filehash`: `string` ; `shareid`: `string` ; `sharelink`: `string`  }\>

#### Defined in

sds/remoteFileSystem/remoteFileSystem.ts:844

___

### stopFileSharing

▸ **stopFileSharing**(`keypair`, `shareid`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) |
| `shareid` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

sds/remoteFileSystem/remoteFileSystem.ts:904

___

### updloadFile

▸ **updloadFile**(`keypair`, `fileReadPath`): `Promise`\<\{ `fileStatusInfo`: [`UploadedFileStatusInfo`](../interfaces/sds.remoteFileSystem.remoteFileSystemTypes.UploadedFileStatusInfo.md) ; `filehash`: `string` ; `uploadReturn`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) |
| `fileReadPath` | `string` |

#### Returns

`Promise`\<\{ `fileStatusInfo`: [`UploadedFileStatusInfo`](../interfaces/sds.remoteFileSystem.remoteFileSystemTypes.UploadedFileStatusInfo.md) ; `filehash`: `string` ; `uploadReturn`: `string`  }\>

#### Defined in

sds/remoteFileSystem/remoteFileSystem.ts:495

___

### updloadFileFromBuffer

▸ **updloadFileFromBuffer**(`keypair`, `fileBuffer`, `resolvedFileName`, `fileHash`, `fileSize`, `progressCb?`): `Promise`\<\{ `fileStatusInfo`: [`UploadedFileStatusInfo`](../interfaces/sds.remoteFileSystem.remoteFileSystemTypes.UploadedFileStatusInfo.md) ; `filehash`: `string` ; `uploadReturn`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/crypto.hdVault.hdVaultTypes.KeyPairInfo.md) |
| `fileBuffer` | `Buffer` |
| `resolvedFileName` | `string` |
| `fileHash` | `string` |
| `fileSize` | `number` |
| `progressCb` | (`data`: [`ProgressCbData`](sds.remoteFileSystem.remoteFileSystemTypes.md#progresscbdata)) => `void` |

#### Returns

`Promise`\<\{ `fileStatusInfo`: [`UploadedFileStatusInfo`](../interfaces/sds.remoteFileSystem.remoteFileSystemTypes.UploadedFileStatusInfo.md) ; `filehash`: `string` ; `uploadReturn`: `string`  }\>

#### Defined in

sds/remoteFileSystem/remoteFileSystem.ts:508
