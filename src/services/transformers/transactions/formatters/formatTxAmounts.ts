import * as NetworkTypes from '../../../network/types';
import { create as createBigNumber, fromWei, ROUND_DOWN } from '../../../../services/bigNumber';
import { decimalPrecision } from '../../../../config/tokens';
import { stratosTopDenom } from '../../../../config/hdVault';

const caclulateAmount = (singleAmount: string) => {
  const balanceInWei = createBigNumber(singleAmount);

  const txAmount = fromWei(balanceInWei, decimalPrecision).toFormat(4, ROUND_DOWN);
  const currentAmount = `${txAmount} ${stratosTopDenom.toUpperCase()}`;

  return currentAmount || '0';
};

const caclulateEventAmount = (txItem: NetworkTypes.BlockChainTx): string => {
  const attributes = txItem?.logs[0]?.events[0]?.attributes;
  // console.log(
  //   '🚀 ~ file: formatTxAmounts.ts ~ line 17 ~ caclulateEventAmount ~ events',
  //   JSON.stringify(txItem?.logs[0]?.events, null, 2),
  // );

  let eventAmount = '';

  if (Array.isArray(attributes)) {
    attributes.forEach(element => {
      if (!eventAmount && element.key === 'amount') {
        eventAmount = element.value;
      }
    });
  }

  if (!eventAmount) {
    return '0';
  }

  const currentAmount = caclulateAmount(eventAmount);

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
