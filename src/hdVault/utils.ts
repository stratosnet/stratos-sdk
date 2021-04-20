import naclUtil from 'tweetnacl-util';

export const hexStrToBuffer = (input: string): Buffer => Buffer.from(input, 'hex');

export const hexStrToUint8Array = (input: string): Uint8Array => Uint8Array.from(Buffer.from(input, 'hex'));

export const bufferToHexStr = (input: Buffer): string => input.toString('hex');

export const bufferToUint8Array = (input: Buffer): Uint8Array => Uint8Array.from(input);

export const uint8arrayToHexStr = (input: Uint8Array): string => Buffer.from(input).toString('hex');

export const uint8ArrayToBuffer = (input: Uint8Array): Buffer => hexStrToBuffer(uint8arrayToHexStr(input));

export const uint8ArrayToBase64str = (input: Uint8Array): string => naclUtil.encodeBase64(input);

export const stringToHex = (input: string): string => Buffer.from(input, 'utf8').toString('hex');

export const hexToString = (input: string): string => Buffer.from(input, 'hex').toString('utf-8');
