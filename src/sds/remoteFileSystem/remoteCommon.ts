import { accountsApi } from '../../accounts';

export const getCurrentSequenceString = async (address: string): Promise<string> => {
  const ozoneBalance = await accountsApi.getOtherBalanceCardMetrics(address);

  const { detailedBalance } = ozoneBalance;

  if (!detailedBalance) {
    throw new Error('no sequence is presented in the ozone balance response');
  }

  const { sequence } = detailedBalance;

  return `${sequence ? sequence : ''}`;
};
