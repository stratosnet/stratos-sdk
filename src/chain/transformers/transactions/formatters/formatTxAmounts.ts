import { stratosTopDenom } from '../../../../config/hdVault';
import { decimalPrecision } from '../../../../config/tokens';
import * as NetworkTypes from '../../../../network/networkTypes';
import { create as createBigNumber, fromWei, ROUND_DOWN } from '../../../../services/bigNumber';

export const emptyAmounts = [{ amount: '0', denom: 'n/a' }];

export const caclulateAmount = (singleAmount: string) => {
  const balanceInWei = createBigNumber(singleAmount);

  const txAmount = fromWei(balanceInWei, decimalPrecision).toFixed(4, ROUND_DOWN);
  const currentAmount = `${txAmount} ${stratosTopDenom.toUpperCase()}`;

  return currentAmount || '0';
};

export const formatTxMultipleAmounts = (multipleAmounts: NetworkTypes.Amount[]): NetworkTypes.Amount[] => {
  if (!Array.isArray(multipleAmounts)) {
    return emptyAmounts;
  }

  const amounts = multipleAmounts.map((element: NetworkTypes.Amount) => {
    const currentAmount = caclulateAmount(`${element.amount}`);

    const calculatedAmount = currentAmount || '0';
    return { amount: calculatedAmount.trim(), denom: element.denom };
  });

  return amounts.length ? amounts : emptyAmounts;
};

export const formatTxSingleAmount = (singleAmount: NetworkTypes.Amount): NetworkTypes.Amount[] => {
  const { amount, denom } = singleAmount;

  const calculatedAmount = caclulateAmount(`${amount}`);

  return [{ amount: calculatedAmount.trim(), denom }];
};

export const formatTxAmounts = (txItem: NetworkTypes.BlockChainTx): string => {
  const msg = txItem.tx?.value?.msg[0];

  const singleAmount = (msg as unknown as NetworkTypes.BlockChainDelegatedTxMessage).value?.amount?.amount;
  const multipleAmounts = (msg as unknown as NetworkTypes.BlockChainSentTxMessage).value?.amount;

  if (singleAmount) {
    const currentAmount = caclulateAmount(`${singleAmount}`);

    return currentAmount || '0';
  }

  if (!Array.isArray(multipleAmounts)) {
    return '0';
  }

  const amounts = multipleAmounts.map(element => {
    const currentAmount = caclulateAmount(`${element.amount}`);

    return currentAmount || '0';
  });

  const currentAmount = amounts.join(' ').trim();

  return currentAmount || '0';
};

export const formatTxFee = (feeInfo: NetworkTypes.RestTxFeeInfo): string[] => {
  const { amount } = feeInfo;

  const multipleFees = amount;

  if (!Array.isArray(multipleFees)) {
    return ['0'];
  }

  const amounts = multipleFees.map(element => {
    const currentAmount = caclulateAmount(`${element.amount}`);

    return currentAmount || '0';
  });

  return amounts;
};
