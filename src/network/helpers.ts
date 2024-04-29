import {
  type AvailableBalanceResponse,
  type AvailableBalanceResponseN,
  type AvailableBalanceResponseO,
  type RestPagination,
} from './networkTypes';

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

export const isNewBalanceVersion = (
  response: AvailableBalanceResponse,
): response is AvailableBalanceResponseN => {
  return 'balances' in response;
};

export const isOldBalanceVersion = (
  response: AvailableBalanceResponse,
): response is AvailableBalanceResponseO => {
  return 'result' in response;
};

export const isValidPagination = (pagination: RestPagination | null): pagination is RestPagination => {
  return !!pagination && 'total' in pagination;
};
