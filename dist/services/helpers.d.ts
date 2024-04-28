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
