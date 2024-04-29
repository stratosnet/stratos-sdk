export interface AmountType {
  amount: string;
  denom: string;
}

export interface TransactionValue {
  amount?: AmountType | AmountType[];
}
