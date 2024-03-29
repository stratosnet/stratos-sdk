[Stratos SDK](../README.md) / [Exports](../modules.md) / RemoteFilesystem

# Namespace: RemoteFilesystem

## Table of contents

### Interfaces

- [UploadedFileStatusInfo](../interfaces/RemoteFilesystem.UploadedFileStatusInfo.md)

### Functions

- [downloadFile](RemoteFilesystem.md#downloadfile)
- [downloadSharedFile](RemoteFilesystem.md#downloadsharedfile)
- [getSharedFileList](RemoteFilesystem.md#getsharedfilelist)
- [getUploadedFileList](RemoteFilesystem.md#getuploadedfilelist)
- [getUploadedFilesStatus](RemoteFilesystem.md#getuploadedfilesstatus)
- [shareFile](RemoteFilesystem.md#sharefile)
- [stopFileSharing](RemoteFilesystem.md#stopfilesharing)
- [updloadFile](RemoteFilesystem.md#updloadfile)

## Functions

### downloadFile

▸ **downloadFile**(`keypair`, `filePathToSave`, `filehash`): `Promise`\<\{ `filePathToSave`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/hdVault.wallet.KeyPairInfo.md) |
| `filePathToSave` | `string` |
| `filehash` | `string` |

#### Returns

`Promise`\<\{ `filePathToSave`: `string`  }\>

#### Defined in

sds/remoteFile.ts:258

___

### downloadSharedFile

▸ **downloadSharedFile**(`keypair`, `filePathToSave`, `sharelink`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/hdVault.wallet.KeyPairInfo.md) |
| `filePathToSave` | `string` |
| `sharelink` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

sds/remoteFile.ts:718

___

### getSharedFileList

▸ **getSharedFileList**(`keypair`, `page?`): `Promise`\<\{ `files`: [`SharedFileInfoItem`](../interfaces/networkTypes.SharedFileInfoItem.md)[] ; `totalnumber`: `number`  }\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/hdVault.wallet.KeyPairInfo.md) | `undefined` |
| `page` | `number` | `0` |

#### Returns

`Promise`\<\{ `files`: [`SharedFileInfoItem`](../interfaces/networkTypes.SharedFileInfoItem.md)[] ; `totalnumber`: `number`  }\>

#### Defined in

sds/remoteFile.ts:660

___

### getUploadedFileList

▸ **getUploadedFileList**(`keypair`, `page?`): `Promise`\<`UserFileListResponse`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/hdVault.wallet.KeyPairInfo.md) | `undefined` |
| `page` | `number` | `0` |

#### Returns

`Promise`\<`UserFileListResponse`\>

#### Defined in

sds/remoteFile.ts:219

___

### getUploadedFilesStatus

▸ **getUploadedFilesStatus**(`keypair`, `fileHash`): `Promise`\<[`UploadedFileStatusInfo`](../interfaces/RemoteFilesystem.UploadedFileStatusInfo.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/hdVault.wallet.KeyPairInfo.md) |
| `fileHash` | `string` |

#### Returns

`Promise`\<[`UploadedFileStatusInfo`](../interfaces/RemoteFilesystem.UploadedFileStatusInfo.md)\>

#### Defined in

sds/remoteFile.ts:153

___

### shareFile

▸ **shareFile**(`keypair`, `filehash`): `Promise`\<\{ `filehash`: `string` ; `shareid`: `string` ; `sharelink`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/hdVault.wallet.KeyPairInfo.md) |
| `filehash` | `string` |

#### Returns

`Promise`\<\{ `filehash`: `string` ; `shareid`: `string` ; `sharelink`: `string`  }\>

#### Defined in

sds/remoteFile.ts:556

___

### stopFileSharing

▸ **stopFileSharing**(`keypair`, `shareid`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/hdVault.wallet.KeyPairInfo.md) |
| `shareid` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

sds/remoteFile.ts:616

___

### updloadFile

▸ **updloadFile**(`keypair`, `fileReadPath`): `Promise`\<\{ `fileStatusInfo`: [`UploadedFileStatusInfo`](../interfaces/RemoteFilesystem.UploadedFileStatusInfo.md) ; `filehash`: `string` ; `uploadReturn`: `string`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keypair` | [`KeyPairInfo`](../interfaces/hdVault.wallet.KeyPairInfo.md) |
| `fileReadPath` | `string` |

#### Returns

`Promise`\<\{ `fileStatusInfo`: [`UploadedFileStatusInfo`](../interfaces/RemoteFilesystem.UploadedFileStatusInfo.md) ; `filehash`: `string` ; `uploadReturn`: `string`  }\>

#### Defined in

sds/remoteFile.ts:358
