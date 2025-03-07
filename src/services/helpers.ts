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

export const humanStringToHexString = (input: string): string => Buffer.from(input).toString('hex');
export const hexStringToHumanString = (input: string): string => Buffer.from(input, 'hex').toString();
export const humanStringToBase64String = (input: string): string => Buffer.from(input).toString('base64');
export const base64StringToHumanString = (input: string): string => Buffer.from(input, 'base64').toString();
export const uint8arrayToHexStr = (input: Uint8Array): string => Buffer.from(input).toString('hex');
export const uint8arrayToBase64Str = (input: Uint8Array): string => Buffer.from(input).toString('base64');
export const hexToBytes = (input: string): Uint8Array => new Uint8Array(Buffer.from(input, 'hex'));
export const uint8arrayToHumanString = (input: Uint8Array): string => Buffer.from(input).toString();

// example - createDateTimeString("2025-12-25", "23:59:59") // "2025-12-25T23:59:59-05:00"
export const createDateTimeString = (startLocalDate?: string, startLocalTime?: string): string => {
  const formatNumber = (n: number) => n.toString().padStart(2, '0');

  const formatOffset = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const sign = offset > 0 ? '-' : '+';
    const hours = formatNumber(Math.floor(Math.abs(offset) / 60));
    const minutes = formatNumber(Math.abs(offset) % 60);
    return `${sign}${hours}:${minutes}`;
  };

  const dateObj = new Date();

  if (startLocalDate) {
    const [year, month, day] = startLocalDate.split('-').map(Number);
    dateObj.setFullYear(year, month - 1, day); // Months are 0-based
  }

  if (startLocalTime) {
    const [hours, minutes, seconds] = startLocalTime.split(':').map(Number);
    dateObj.setHours(hours, minutes, seconds || 0, 0);
  }

  return [
    [dateObj.getFullYear(), formatNumber(dateObj.getMonth() + 1), formatNumber(dateObj.getDate())].join('-'),
    'T',
    [
      formatNumber(dateObj.getHours()),
      formatNumber(dateObj.getMinutes()),
      formatNumber(dateObj.getSeconds()),
    ].join(':'),
    formatOffset(dateObj),
  ].join('');
};
