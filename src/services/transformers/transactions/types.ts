export interface TxAmount {
  amount: string;
  denom: string;
}

export interface TxMsgValue {
  sender?: string;
  reporter?: string;
  delegator_address?: string;
  from_address?: string;
  amount?: TxAmount | TxAmount[];
  to_address?: string;
}

export interface TxMessage {
  value: TxMsgValue;
  type: string; // tx type
}

export interface ReturnT {
  sender: string | null;
  nonce: null;
  data: any;
  msg?: TxMessage;
}

export type TxFormatter = (msg: TxMessage, sender?: string) => ReturnT | null;
