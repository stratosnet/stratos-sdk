import CID from 'cids';
import crypto from 'crypto';
import fs from 'fs';
import multihashing from 'multihashing-async';
import * as Types from './types';

async function wait(fn: any, ms: number) {
  while (!fn()) {
    await delay(ms);
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getFileBuffer = async (filePath: string): Promise<Buffer> => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer;
  } catch (err) {
    throw new Error(`Could not read a file from ${filePath}: Details: ${(err as Error).message}`);
  }
};

export const calculateFileHash = async (filePath: string): Promise<string> => {
  const fileBuffer = await getFileBuffer(filePath);
  const md5Digest = crypto.createHash('md5').update(fileBuffer).digest();

  const encodedHash = await multihashing(md5Digest, 'keccak-256', 20);

  const cid = new CID(1, 'raw', encodedHash, 'base32hex');

  const realFileHash = cid.toString();

  return realFileHash;
};

const processFileChunk = async () => {};

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

          if (!chunk || !chunk.length) {
            break;
          }

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

export async function encodeBuffer(chunk: Buffer): Promise<string> {
  await delay(2000);
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

export const getEncodedFileChunks = async (filePath: string, chunksSize = 10000): Promise<string[]> => {
  const fileChunksList = await getFileChunks(filePath, chunksSize);
  const encodedFileChunksList = await encodeFileChunks(fileChunksList);

  return encodedFileChunksList;
};

export const writeFileToPath = async (filePath: string, econdedFileContent: string) => {
  const decodedFileBuffer = Buffer.from(econdedFileContent, 'base64');
  return writeFile(filePath, decodedFileBuffer);
};

export const writeFile = (filePath: string, fileBuffer: Buffer) => {
  try {
    fs.writeFileSync(filePath, fileBuffer);
  } catch (err) {
    console.log(`Could not write file to ${filePath}: Details: ${(err as Error).message}`);
  }
};
