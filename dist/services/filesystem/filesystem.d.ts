/// <reference types="node" />
export declare const getFileBuffer: (filePath: string) => Promise<Buffer>;
export declare const calculateFileHash: (filePath: string) => Promise<string>;
export interface OpenedFileInfo {
    size: number;
    filehash: string;
}
export declare const getFileInfo: (filePath: string) => Promise<OpenedFileInfo>;
export declare const getFileChunks: (filePath: string, chunkSize?: number) => Promise<Buffer[]>;
export declare function encodeBuffer(chunk: Buffer): Promise<string>;
export declare const encodeFile: (fileBuffer: Buffer) => Promise<string>;
export declare const encodeFileFromPath: (filePath: string) => Promise<string>;
export declare const combineDecodedChunks: (fileChunksList: Buffer[]) => Buffer;
export declare const encodeFileChunks: (chunksList: Buffer[]) => Promise<string[]>;
export declare const decodeFileChunks: (encodedChunksList: string[]) => Promise<Buffer[]>;
export declare const getEncodedFileChunks: (filePath: string, chunksSize?: number) => Promise<string[]>;
export declare const writeFileToPath: (filePath: string, econdedFileContent: string) => Promise<void>;
export declare const writeFile: (filePath: string, fileBuffer: Buffer) => void;
