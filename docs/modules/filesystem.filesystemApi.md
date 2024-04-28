[Stratos SDK](../README.md) / [Exports](../modules.md) / [filesystem](filesystem.md) / filesystemApi

# Namespace: filesystemApi

[filesystem](filesystem.md).filesystemApi

## Table of contents

### Functions

- [calculateFileHash](filesystem.filesystemApi.md#calculatefilehash)
- [calculateFileHashFromBuffer](filesystem.filesystemApi.md#calculatefilehashfrombuffer)
- [calculateFileHashOld](filesystem.filesystemApi.md#calculatefilehashold)
- [combineDecodedChunks](filesystem.filesystemApi.md#combinedecodedchunks)
- [decodeFileChunks](filesystem.filesystemApi.md#decodefilechunks)
- [encodeBuffer](filesystem.filesystemApi.md#encodebuffer)
- [encodeFile](filesystem.filesystemApi.md#encodefile)
- [encodeFileChunks](filesystem.filesystemApi.md#encodefilechunks)
- [encodeFileFromPath](filesystem.filesystemApi.md#encodefilefrompath)
- [getEncodedFileChunks](filesystem.filesystemApi.md#getencodedfilechunks)
- [getFileBuffer](filesystem.filesystemApi.md#getfilebuffer)
- [getFileChunk](filesystem.filesystemApi.md#getfilechunk)
- [getFileChunks](filesystem.filesystemApi.md#getfilechunks)
- [getFileInfo](filesystem.filesystemApi.md#getfileinfo)
- [getLocalFileReadStream](filesystem.filesystemApi.md#getlocalfilereadstream)
- [writeFile](filesystem.filesystemApi.md#writefile)
- [writeFileToPath](filesystem.filesystemApi.md#writefiletopath)

## Functions

### calculateFileHash

▸ **calculateFileHash**(`filePath`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

filesystem/filesystem.ts:58

___

### calculateFileHashFromBuffer

▸ **calculateFileHashFromBuffer**(`fileBuffer`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileBuffer` | `Buffer` |

#### Returns

`Promise`\<`string`\>

#### Defined in

filesystem/filesystem.ts:38

___

### calculateFileHashOld

▸ **calculateFileHashOld**(`filePath`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

filesystem/filesystem.ts:25

___

### combineDecodedChunks

▸ **combineDecodedChunks**(`fileChunksList`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileChunksList` | `Buffer`[] |

#### Returns

`Buffer`

#### Defined in

filesystem/filesystem.ts:189

___

### decodeFileChunks

▸ **decodeFileChunks**(`encodedChunksList`): `Promise`\<`Buffer`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `encodedChunksList` | `string`[] |

#### Returns

`Promise`\<`Buffer`[]\>

#### Defined in

filesystem/filesystem.ts:204

___

### encodeBuffer

▸ **encodeBuffer**(`chunk`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunk` | `Buffer` |

#### Returns

`Promise`\<`string`\>

#### Defined in

filesystem/filesystem.ts:168

___

### encodeFile

▸ **encodeFile**(`fileBuffer`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileBuffer` | `Buffer` |

#### Returns

`Promise`\<`string`\>

#### Defined in

filesystem/filesystem.ts:176

___

### encodeFileChunks

▸ **encodeFileChunks**(`chunksList`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `chunksList` | `Buffer`[] |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

filesystem/filesystem.ts:194

___

### encodeFileFromPath

▸ **encodeFileFromPath**(`filePath`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

filesystem/filesystem.ts:182

___

### getEncodedFileChunks

▸ **getEncodedFileChunks**(`filePath`, `chunkSize?`): `Promise`\<`string`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `filePath` | `string` | `undefined` |
| `chunkSize` | `number` | `10000` |

#### Returns

`Promise`\<`string`[]\>

#### Defined in

filesystem/filesystem.ts:210

___

### getFileBuffer

▸ **getFileBuffer**(`filePath`): `Promise`\<`Buffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<`Buffer`\>

#### Defined in

filesystem/filesystem.ts:16

___

### getFileChunk

▸ **getFileChunk**(`fileStream`, `readChunkSize`): `Promise`\<`Buffer`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `fileStream` | `ReadStream` |
| `readChunkSize` | `number` |

#### Returns

`Promise`\<`Buffer`\>

#### Defined in

filesystem/filesystem.ts:152

___

### getFileChunks

▸ **getFileChunks**(`filePath`, `chunkSize?`): `Promise`\<`Buffer`[]\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `filePath` | `string` | `undefined` |
| `chunkSize` | `number` | `10000` |

#### Returns

`Promise`\<`Buffer`[]\>

#### Defined in

filesystem/filesystem.ts:109

___

### getFileInfo

▸ **getFileInfo**(`filePath`): `Promise`\<[`OpenedFileInfo`](../interfaces/filesystem.filesystemTypes.OpenedFileInfo.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<[`OpenedFileInfo`](../interfaces/filesystem.filesystemTypes.OpenedFileInfo.md)\>

#### Defined in

filesystem/filesystem.ts:78

___

### getLocalFileReadStream

▸ **getLocalFileReadStream**(`filePath`): `Promise`\<`ReadStream`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`\<`ReadStream`\>

#### Defined in

filesystem/filesystem.ts:216

___

### writeFile

▸ **writeFile**(`filePath`, `fileBuffer`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `fileBuffer` | `Buffer` |

#### Returns

`void`

#### Defined in

filesystem/filesystem.ts:238

___

### writeFileToPath

▸ **writeFileToPath**(`filePath`, `econdedFileContent`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `econdedFileContent` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

filesystem/filesystem.ts:246
