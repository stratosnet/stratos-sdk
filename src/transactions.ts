import cosmosjs from '@cosmostation/cosmosjs';

import { stratosDenom } from './config/hdVault';
import { chainId, lcdUrl } from './config/network';
import { KeyPairInfo } from './hdVault/wallet';

export interface AccountsData {
  height: string;
  result: {
    type: 'cosmos-sdk/Account';
    value: {
      address: string;
      public_key: any;
      account_number: string;
      sequence: string;
    };
  };
}

interface BroadcastResult {
  height: string;
  txhash: string;
  raw_log?: string;
}

interface AmountType {
  amount: string;
  denom: string;
}

interface SendTransactionValue {
  amount: AmountType[];
  from_address: string;
  to_address: string;
}

// type TransactionType = 'cosmos-sdk/MsgSend' | 'cosmos-sdk/MsgAnother';
// type TransactionValue = SendTransactionValue;

interface TransactionMessage {
  type: string; // change to TransactionType
  value: SendTransactionValue; // change to TransactionValue
}

interface Transaction {
  msgs: TransactionMessage[];
  chain_id: string;
  account_number: string;
  sequence: string;
}

interface SignedTransaction {
  tx: {
    msg: any[];
    fee: any;
    signatures: any[];
    memo: string;
  };
  mode: 'sync';
}

interface CosmosInstance {
  url: string;
  chainId: string;
  path: string;
  bech32MainPrefix: string;
  broadcast(signedTx: SignedTransaction): Promise<BroadcastResult>;
  newStdMsg(tx: Transaction): TransactionMessage;
  sign(txMessage: TransactionMessage, pkey: Buffer): SignedTransaction;
  getAccounts(address: string): Promise<AccountsData>;
}

class StratosCosmos {
  public static cosmosInstance: CosmosInstance;

  public static init(): void {
    StratosCosmos.cosmosInstance = cosmosjs.network(lcdUrl, chainId);
  }
}

export const getCosmos = (): CosmosInstance => {
  if (!StratosCosmos.cosmosInstance) {
    StratosCosmos.init();
  }

  return StratosCosmos.cosmosInstance;
};

export const broadcastTx = async (signedTx: SignedTransaction): Promise<BroadcastResult> => {
  try {
    const result = await getCosmos().broadcast(signedTx);

    // add pproper error handling!! check for code!
    return result;
  } catch (err) {
    console.log('Could not broadcast', err.message);

    throw err;
  }
};

export const getAccountsData = async (keyPair: KeyPairInfo): Promise<AccountsData> => {
  try {
    const accountsData = await getCosmos().getAccounts(keyPair.address);
    return accountsData;
  } catch (err) {
    console.log('Could not get accounts', err.message);
    throw err;
  }
};

export const createSendTx = async (
  amount: number,
  keyPair: KeyPairInfo,
  toAddress: string,
  memo = '',
): Promise<Transaction> => {
  const accountsData = await getAccountsData(keyPair);

  const myTx = {
    msgs: [
      {
        type: 'cosmos-sdk/MsgSend',
        value: {
          amount: [
            {
              amount: String(amount),
              denom: stratosDenom,
            },
          ],
          from_address: keyPair.address,
          to_address: toAddress,
        },
      },
    ],
    chain_id: chainId,
    fee: { amount: [{ amount: String(500), denom: stratosDenom }], gas: String(200000) },
    memo,
    account_number: String(accountsData.result.value.account_number),
    sequence: String(accountsData.result.value.sequence),
  };

  return myTx;
};
