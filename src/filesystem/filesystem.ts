import CIDM from 'cids';
import crypto from 'crypto';
import fs from 'fs';
import { base32hex } from 'multiformats/bases/base32';
import { CID } from 'multiformats/cid';
import * as hasher from 'multiformats/hashes/hasher';
import multihashing from 'multihashing-async';
import { delay } from '../services/helpers';
import { type OpenedFileInfo } from './types';

export const getFileBuffer = async (filePath: string): Promise<Buffer> => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer;
  } catch (err) {
    throw new Error(`Could not read a file from ${filePath}: Details: ${(err as Error).message}`);
  }
};

export const calculateFileHashOld = async (filePath: string): Promise<string> => {
  const fileBuffer = await getFileBuffer(filePath);
  const md5Digest = crypto.createHash('md5').update(fileBuffer).digest();

  const encodedHash = await multihashing(md5Digest, 'keccak-256', 20);

  const cid = new CIDM(1, 'raw', encodedHash, 'base32hex');

  const realFileHash = cid.toString();

  return realFileHash;
};

export const calculateFileHashFromBuffer = async (fileBuffer: Buffer): Promise<string> => {
  const firstKeccak = await multihashing(fileBuffer, 'keccak-256', 20);
  const secondKeccak = await multihashing(firstKeccak, 'keccak-256', 20);

  const keccak256Hasher = hasher.from({
    name: 'keccak-256',
    code: 0x1b,
    encode: input => input.slice(-20),
  });

  const encodedHashO = await keccak256Hasher.digest(secondKeccak);

  const cid = CID.create(1, 0x66, encodedHashO);
  const realFileHash = cid.toString(base32hex);

  return realFileHash;
};

export const calculateFileHash = async (filePath: string): Promise<string> => {
  const fileBuffer = await getFileBuffer(filePath);
  return calculateFileHashFromBuffer(fileBuffer);
};

export const getFileInfo = async (filePath: string): Promise<OpenedFileInfo> => {
  let openedFileInfo: OpenedFileInfo = { size: 0, filehash: '' };

  try {
    const fileStream = fs.createReadStream(filePath);
    const stats = fs.statSync(filePath);

    const _filehash = await calculateFileHash(filePath);

    openedFileInfo = await new Promise((resolve, reject) => {
      const result = {
        size: 0,
        filehash: _filehash,
      };

      fileStream.on('readable', function () {
        result.size = stats.size;
        resolve(result);
      });

      fileStream.on('error', function (error) {
        reject(error);
      });
    });
  } catch (error) {
    console.log(error);
  }

  return openedFileInfo;
};

export const getFileChunks = async (filePath: string, chunkSize = 10000): Promise<Buffer[]> => {
  let chunksList: Buffer[] = [];
  try {
    const fileStream = fs.createReadStream(filePath);
    const stats = fs.statSync(filePath);

    chunksList = await new Promise((resolve, reject) => {
      let bytesRead = 0;
      const result: Buffer[] = [];

      fileStream.on('readable', function () {
        /* eslint-disable-next-line no-constant-condition */
        while (true) {
          // no-constant-condition
          const chunk = fileStream.read(chunkSize);

          console.log('ch size', chunkSize);

          if (!chunk || !chunk.length) {
            break;
          }

          console.log('chunked chunk length', chunk.length);
          bytesRead += chunk.length;

          result.push(chunk);
        }

        if (bytesRead >= stats.size) {
          resolve(result);
        }
      });
      fileStream.on('error', function (error) {
        reject(error);
      });
    });
  } catch (error) {
    console.log(error);
  }
  return chunksList;
};

export const getFileChunk = async (fileStream: fs.ReadStream, readChunkSize: number): Promise<Buffer> => {
  let chunksList: Buffer;

  try {
    chunksList = await new Promise(resolve => {
      const chunk = fileStream.read(readChunkSize);

      resolve(chunk);
    });
  } catch (error) {
    console.log(error);
    throw 'could not read file chunk';
  }
  return chunksList;
};

export async function encodeBuffer(chunk: Buffer): Promise<string> {
  await delay(100);
  // NOTE: Cannot create a string longer than 0x1fffffe8 characters
  const base64data = chunk.toString('base64');
  return base64data;
}

export const encodeFile = async (fileBuffer: Buffer) => {
  const encodedFile = await encodeBuffer(fileBuffer);
  return encodedFile;
};

export const encodeFileFromPath = async (filePath: string) => {
  const fileChunksList = await getFileChunks(filePath);
  const fileBuffer = combineDecodedChunks(fileChunksList);
  const encodedFile = await encodeFile(fileBuffer);
  return encodedFile;
};

export const combineDecodedChunks = (fileChunksList: Buffer[]): Buffer => {
  const fileBuffer = Buffer.concat(fileChunksList);
  return fileBuffer;
};

export const encodeFileChunks = async (chunksList: Buffer[]): Promise<string[]> => {
  const chunksOfBase64Promises = chunksList.map(async chunk => {
    const encodedChunk = await encodeBuffer(chunk);
    return encodedChunk;
  });

  const encodedChunksList = await Promise.all(chunksOfBase64Promises);
  return encodedChunksList;
};

export const decodeFileChunks = async (encodedChunksList: string[]): Promise<Buffer[]> => {
  const decodedChunksList = encodedChunksList.map(base64dataChunk => Buffer.from(base64dataChunk, 'base64'));

  return decodedChunksList;
};

export const getEncodedFileChunks = async (filePath: string, chunkSize = 10000): Promise<string[]> => {
  const fileChunksList = await getFileChunks(filePath, chunkSize);
  const encodedFileChunksList = await encodeFileChunks(fileChunksList);
  return encodedFileChunksList;
};

export const getLocalFileReadStream = async (filePath: string): Promise<fs.ReadStream> => {
  try {
    const fileStream = fs.createReadStream(filePath);

    const myStream: fs.ReadStream = await new Promise((resolve, reject) => {
      fileStream.on('readable', function () {
        resolve(fileStream);
      });

      fileStream.on('error', function (error) {
        reject(error);
      });
    });

    return myStream;
  } catch (error) {
    const errorMessage = `could not create file stream at path ${filePath}`;
    console.log(errorMessage, error);
    throw new Error(errorMessage);
  }
};

export const writeFile = (filePath: string, fileBuffer: Buffer) => {
  try {
    fs.writeFileSync(filePath, fileBuffer);
  } catch (err) {
    console.log(`Could not write file to ${filePath}: Details: ${(err as Error).message}`);
  }
};

export const writeFileToPath = async (filePath: string, econdedFileContent: string) => {
  const decodedFileBuffer = Buffer.from(econdedFileContent, 'base64');
  return writeFile(filePath, decodedFileBuffer);
};
