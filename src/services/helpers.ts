export const now = () => new Date().toLocaleString();

// NOTE - did log for console output -
// use -> console.dir(result, { depth: null, colors: true, maxArrayLength: null });
export const log = (message: string, ...rest: any) => {
  console.log(
    `"${now()}" - ${message}`,
    (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '',
  );
};

export const dirLog = (message: string, ...rest: any) => {
  const opts = { depth: null, colors: true, maxArrayLength: null };

  const otherData = (Array.isArray(rest) && rest.length) || Object.keys(rest).length ? rest : '';

  const data = { messageTime: `"${now()}" - ${message}`, message, otherData };
  console.dir(data, opts);
};

export async function wait(fn: any, ms: number) {
  while (!fn()) {
    await delay(ms);
  }
}

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function getCurrentTimestamp() {
  return Date.now();
}

export function toArrayBuffer(buffer: Buffer) {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

export function toBuffer(arrayBuffer: ArrayBuffer) {
  const buffer = Buffer.alloc(arrayBuffer.byteLength);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i];
  }
  return buffer;
}
