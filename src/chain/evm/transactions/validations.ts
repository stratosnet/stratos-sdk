export const evmTransactionFields = [
  { name: 'chainId', maxLength: 32 },
  { name: 'nonce', maxLength: 32 },
  { name: 'gasTipCap', maxLength: 32 },
  { name: 'gasFeeCap', maxLength: 32 },
  { name: 'gas', maxLength: 32 },
  { name: 'to', length: 20 },
  { name: 'value', maxLength: 32 },
  { name: 'data' },
  { name: 'accesses', asStruct: true },
];
