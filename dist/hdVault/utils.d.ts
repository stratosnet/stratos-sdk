/// <reference types="node" />
export declare const hexStrToBuffer: (input: string) => Buffer;
export declare const hexStrToUint8Array: (input: string) => Uint8Array;
export declare const bufferToHexStr: (input: Buffer) => string;
export declare const bufferToUint8Array: (input: Buffer) => Uint8Array;
export declare const uint8arrayToHexStr: (input: Uint8Array) => string;
export declare const uint8ArrayToBuffer: (input: Uint8Array) => Buffer;
export declare const uint8ArrayToBase64str: (input: Uint8Array) => string;
export declare const stringToHex: (input: string) => string;
export declare const hexToString: (input: string) => string;
export declare function mergeUint8Arrays(a1: Uint8Array, a2: Uint8Array): Uint8Array;
