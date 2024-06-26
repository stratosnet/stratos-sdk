/// <reference types="node" />
export declare const now: () => string;
export declare const log: (message: string, ...rest: any) => void;
export declare const dirLog: (message: string, ...rest: any) => void;
export declare function wait(fn: any, ms: number): Promise<void>;
export declare function delay(ms: number): Promise<unknown>;
export declare function getTimestampInSeconds(): number;
export declare function getCurrentTimestamp(): number;
export declare function toArrayBuffer(buffer: Buffer): ArrayBuffer;
export declare function toBuffer(arrayBuffer: ArrayBuffer): Buffer;
export declare const humanStringToHexString: (input: string) => string;
export declare const hexStringToHumanString: (input: string) => string;
export declare const humanStringToBase64String: (input: string) => string;
export declare const base64StringToHumanString: (input: string) => string;
export declare const uint8arrayToHexStr: (input: Uint8Array) => string;
export declare const uint8arrayToBase64Str: (input: Uint8Array) => string;
export declare const hexToBytes: (input: string) => Uint8Array;
export declare const uint8arrayToHumanString: (input: Uint8Array) => string;
