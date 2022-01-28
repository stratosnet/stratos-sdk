import { stratosTopDenom } from '../../../../config/hdVault';
import { decimalPrecision } from '../../../../config/tokens';
import { create as createBigNumber, fromWei, ROUND_DOWN } from '../../../../services/bigNumber';
import * as NetworkTypes from '../../../network/types';

const caclulateAmount = (singleAmount: string) => {
  const balanceInWei = createBigNumber(singleAmount);

  const txAmount = fromWei(balanceInWei, decimalPrecision).toFormat(4, ROUND_DOWN);
  const currentAmount = `${txAmount} ${stratosTopDenom.toUpperCase()}`;

  return currentAmount || '0';
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

export const formatTxFee = (txItem: NetworkTypes.BlockChainTx): string => {
  const fee = txItem.tx?.value?.fee;

  const multipleFees = fee?.amount;

  if (!Array.isArray(multipleFees)) {
    return '0';
  }

  const amounts = multipleFees.map(element => {
    const currentAmount = caclulateAmount(`${element.amount}`);

    return currentAmount || '0';
  });

  const currentAmount = amounts.join(' ').trim();

  return currentAmount || '0';
};
