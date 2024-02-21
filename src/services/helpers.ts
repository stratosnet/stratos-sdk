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

export const getNewProtocolFlag = (currentVersion: string, minRequiredNewVersion: string) => {
  console.log('current protocol version ', currentVersion);
  const [pVer, pSubVer, pPatch] = currentVersion.split('.');
  const [minVer, minSubVer, minPatch] = minRequiredNewVersion.split('.');

  const isVerOld = +pVer < +minVer;
  const isSubVerOld = +pSubVer < +minSubVer;
  const isPatchOld = +pPatch < +minPatch;

  const isOldProtocol = isVerOld && isSubVerOld && isPatchOld;

  return !isOldProtocol;
};
