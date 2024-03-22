import { stratosDenom, stratosOzDenom, stratosTopDenom, stratosUozDenom } from '../../config/hdVault';
import { decimalPrecision, decimalShortPrecision } from '../../config/tokens';
import { create as createBigNumber, fromWei, ROUND_DOWN } from '../../services/bigNumber';

export const getBalanceCardMetricDinamicValue = (denom?: string | undefined, amount?: string | undefined) => {
  const isStratosDenom = denom === stratosDenom;

  if (!isStratosDenom) {
    return '0.0000 STOS';
  }
  if (!amount) {
    return '0.0000 STOS';
  }
  const balanceInWei = createBigNumber(amount);

  let dynamicPrecision = decimalShortPrecision;

  let counter = 0;

  let balance = '0';

  // @todo move it to const
  const maxAdditionalDigits = 4;

  let isStillZero = counter < maxAdditionalDigits;

  do {
    balance = fromWei(balanceInWei, decimalPrecision).toFormat(dynamicPrecision, ROUND_DOWN);
    const parsetBalance = parseFloat(balance);
    isStillZero = parsetBalance === 0 && counter < maxAdditionalDigits;
    dynamicPrecision++;
    counter++;
  } while (isStillZero);

  const balanceToReturn = `${balance} ${stratosTopDenom.toUpperCase()}`;

  return balanceToReturn;
};

export const getBalanceCardMetricValue = (denom?: string | undefined, amount?: string | undefined) => {
  const isStratosDenom = denom === stratosDenom;

  if (!isStratosDenom) {
    return '0.0000 STOS';
  }
  if (!amount) {
    return '0.0000 STOS';
  }
  const balanceInWei = createBigNumber(amount);

  const balance = fromWei(balanceInWei, decimalPrecision).toFormat(decimalShortPrecision, ROUND_DOWN);
  const balanceToReturn = `${balance} ${stratosTopDenom.toUpperCase()}`;
  return balanceToReturn;
};

// @todo merge with get balance card value
export const getOzoneMetricValue = (denom?: string | undefined, amount?: string | undefined) => {
  const isStratosDenom = denom === stratosUozDenom;

  const printableDenome = stratosOzDenom.toUpperCase();

  if (!isStratosDenom) {
    return `0.0000 ${printableDenome}`;
  }
  if (!amount) {
    return `0.0000 ${printableDenome}`;
  }

  const balanceInWei = createBigNumber(amount);

  const balance = fromWei(balanceInWei, 9).toFormat(decimalShortPrecision, ROUND_DOWN);
  // console.log('oz balance', balance);
  const balanceToReturn = `${balance} ${printableDenome}`;
  return balanceToReturn;
};
