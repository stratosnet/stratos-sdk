// import '@testing-library/jest-dom/extend-expect';

// import { toWei } from '../services/bigNumber';
// import * as Cosmos from '../services/cosmos';
// import * as Transactions from './transactions';
// import * as Types from './types';

// import { fromHex } from '@cosmjs/encoding';
// import * as Utils from '../hdVault/utils';
// import * as ValidatorsTypes from '../validators/types';
// import * as ValidatorsApi from '../validators/validators';

// describe('transactions', () => {
//   describe('broadcast', () => {
//     it('broadcasts transaction', async () => {
//       const fakeBroadcastResult = {
//         height: '1',
//         txhash: 'abcde',
//       };

//       const fakeCosmos = {
//         broadcast: jest.fn(() => {
//           return fakeBroadcastResult;
//         }),
//       } as unknown as Cosmos.CosmosInstance;

//       const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
//         return fakeCosmos;
//       });

//       const spyBroadcast = jest.spyOn(fakeCosmos, 'broadcast');

//       const signedTx = {
//         foo: 'bar',
//       } as unknown as Types.SignedTransaction;

//       const result = await Transactions.broadcast(signedTx);

//       expect(result).toBe(fakeBroadcastResult);
//       expect(spyBroadcast).toBeCalledWith(signedTx);

//       spyGetCosmos.mockRestore();
//       spyBroadcast.mockRestore();
//     });
//     it('broadcasts transaction throws expected error', async () => {
//       const fakeCosmos = {
//         broadcast: jest.fn(() => {
//           throw new Error('boomm');
//         }),
//       } as unknown as Cosmos.CosmosInstance;

//       const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
//         return fakeCosmos;
//       });

//       const signedTx = {
//         foo: 'bar',
//       } as unknown as Types.SignedTransaction;

//       await expect(Transactions.broadcast(signedTx)).rejects.toThrow('boomm');

//       spyGetCosmos.mockRestore();
//     });
//   });

//   describe('sign', () => {
//     it('signs transaction', async () => {
//       const fakeSignResult = {
//         tx: {
//           foo: 'bar',
//         },
//       };

//       const fakeCosmos = {
//         sign: jest.fn(() => {
//           return fakeSignResult;
//         }),
//       } as unknown as Cosmos.CosmosInstance;

//       const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
//         return fakeCosmos;
//       });

//       const spySign = jest.spyOn(fakeCosmos, 'sign');

//       const txMessage = {
//         foo: 'bar',
//       } as unknown as Types.TransactionMessage;

//       const privateKey = 'abcd';

//       const result = await Transactions.sign(txMessage, privateKey);
//       expect(result).toBe(fakeSignResult);

//       const encodedPkey = Utils.uint8ArrayToBuffer(fromHex(privateKey));
//       expect(spySign).toHaveBeenCalledWith(txMessage, encodedPkey);

//       spyGetCosmos.mockRestore();
//       spySign.mockRestore();
//     });
//   });

//   describe('getStandardFee', () => {
//     it('returns an expected standard fee', async () => {
//       const numberOfMessages = 3;
//       const expectedFee = {
//         amount: [{ amount: String(200000), denom: 'ustos' }],
//         gas: String(500000 + 100000 * numberOfMessages),
//       };

//       const result = Transactions.getStandardFee(numberOfMessages);

//       expect(result).toStrictEqual(expectedFee);
//     });
//   });

//   describe('getStandardAmount', () => {
//     it('returns an expected standard amount list', async () => {
//       const amounts = [2, 5];

//       const expected = [
//         {
//           amount: toWei(amounts[0], 9).toString(),
//           denom: 'ustos',
//         },
//         {
//           amount: toWei(amounts[1], 9).toString(),
//           denom: 'ustos',
//         },
//       ];
//       const result = Transactions.getStandardAmount(amounts);

//       expect(result).toStrictEqual(expected);
//     });
//   });

//   describe('getBaseTx', () => {
//     it('generates a base tx body', async () => {
//       const keyPairAddress = 'myAddress';
//       const myAccountNumber = 'boombam';

//       const fakeAccountData = {
//         result: {
//           type: 'myType',
//           value: {
//             address: keyPairAddress,
//             sequence: '34',
//             account_number: myAccountNumber,
//           },
//         },
//       };

//       const fakeCosmos = {
//         getAccounts: jest.fn(() => {
//           return fakeAccountData;
//         }),
//       } as unknown as Cosmos.CosmosInstance;

//       const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
//         return fakeCosmos;
//       });

//       const myFee = {
//         foobar: 'barfoo',
//       } as unknown as Types.TransactionFee;

//       const spyGetStandardFee = jest.spyOn(Transactions, 'getStandardFee').mockImplementation(() => {
//         return myFee;
//       });

//       const chainId = 'test-chain-1';

//       const expected = {
//         chain_id: chainId,
//         fee: myFee,
//         memo: '',
//         account_number: myAccountNumber,
//         sequence: '34',
//       };

//       const result = await Transactions.getBaseTx(keyPairAddress);

//       expect(result).toStrictEqual(expected);

//       spyGetCosmos.mockRestore();
//       spyGetStandardFee.mockRestore();
//     });
//   });

//   describe('getSendTx', () => {
//     it('returns a send tx', async () => {
//       const keyPairAddress = 'myAddress';
//       const toAddress = 'toAddress';

//       const baseTx = {
//         baseFoo: 'baseBar',
//       } as unknown as Types.BaseTransaction;

//       const spyGetBaseTx = jest.spyOn(Transactions, 'getBaseTx').mockImplementation(() => {
//         return Promise.resolve(baseTx);
//       });

//       const expectedMsgData = {
//         chain_id: '1',
//         barMsg: 'foo',
//         memo: '',
//       };

//       const fakeCosmos = {
//         newStdMsg: jest.fn(() => {
//           return expectedMsgData;
//         }),
//       } as unknown as Cosmos.CosmosInstance;

//       const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
//         return fakeCosmos;
//       });

//       const spyNewStdMsg = jest.spyOn(fakeCosmos, 'newStdMsg');

//       const sendPayload = [
//         {
//           amount: 2,
//           toAddress,
//         },
//       ];

//       const result = await Transactions.getSendTx(keyPairAddress, sendPayload);

//       expect(result).toStrictEqual(expectedMsgData);

//       const myTx = {
//         ...baseTx,
//         msgs: [
//           {
//             type: 'cosmos-sdk/MsgSend',
//             value: {
//               amount: [
//                 {
//                   amount: '2000000000',
//                   denom: 'ustos',
//                 },
//               ],
//               from_address: keyPairAddress,
//               to_address: toAddress,
//             },
//           },
//         ],
//       } as unknown as Types.TransactionMessage;

//       expect(spyNewStdMsg).toHaveBeenCalledWith(myTx);

//       spyGetBaseTx.mockRestore();
//       spyGetCosmos.mockRestore();
//       spyNewStdMsg.mockRestore();
//     });
//   });

//   describe('getDelegateTx', () => {
//     it('returns a delegate tx', async () => {
//       const delegatorAddress = 'myAddress';
//       const validatorAddress = 'toAddress';

//       const baseTx = {
//         baseFoo: 'baseBar',
//       } as unknown as Types.BaseTransaction;

//       const spyGetBaseTx = jest.spyOn(Transactions, 'getBaseTx').mockImplementation(() => {
//         return Promise.resolve(baseTx);
//       });

//       const expectedMsgData = {
//         chain_id: '1',
//         barMsg: 'foo',
//         memo: '',
//       };

//       const fakeCosmos = {
//         newStdMsg: jest.fn(() => {
//           return expectedMsgData;
//         }),
//       } as unknown as Cosmos.CosmosInstance;

//       const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
//         return fakeCosmos;
//       });

//       const spyNewStdMsg = jest.spyOn(fakeCosmos, 'newStdMsg');

//       const delegatePayload = [
//         {
//           amount: 3,
//           validatorAddress,
//         },
//       ];

//       const result = await Transactions.getDelegateTx(delegatorAddress, delegatePayload);

//       expect(result).toStrictEqual(expectedMsgData);

//       const myTx = {
//         ...baseTx,
//         msgs: [
//           {
//             type: 'cosmos-sdk/MsgDelegate',
//             value: {
//               amount: {
//                 amount: '3000000000',
//                 denom: 'ustos',
//               },
//               delegator_address: delegatorAddress,
//               validator_address: validatorAddress,
//             },
//           },
//         ],
//       } as unknown as Types.TransactionMessage;

//       expect(spyNewStdMsg).toHaveBeenCalledWith(myTx);

//       spyGetBaseTx.mockRestore();
//       spyGetCosmos.mockRestore();
//       spyNewStdMsg.mockRestore();
//     });
//   });

//   describe('getUnDelegateTx', () => {
//     it('returns a undelegate tx', async () => {
//       const delegatorAddress = 'myAddress';
//       const validatorAddress = 'toAddress';

//       const baseTx = {
//         baseFoo: 'baseBar',
//       } as unknown as Types.BaseTransaction;

//       const spyGetBaseTx = jest.spyOn(Transactions, 'getBaseTx').mockImplementation(() => {
//         return Promise.resolve(baseTx);
//       });

//       const expectedMsgData = {
//         chain_id: '1',
//         barMsg: 'foo',
//         memo: '',
//       };

//       const fakeCosmos = {
//         newStdMsg: jest.fn(() => {
//           return expectedMsgData;
//         }),
//       } as unknown as Cosmos.CosmosInstance;

//       const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
//         return fakeCosmos;
//       });

//       const spyNewStdMsg = jest.spyOn(fakeCosmos, 'newStdMsg');

//       const unDelegatePayload = [
//         {
//           amount: 4,
//           validatorAddress,
//         },
//       ];

//       const result = await Transactions.getUnDelegateTx(delegatorAddress, unDelegatePayload);

//       expect(result).toStrictEqual(expectedMsgData);

//       const myTx = {
//         ...baseTx,
//         msgs: [
//           {
//             type: 'cosmos-sdk/MsgUndelegate',
//             value: {
//               amount: {
//                 amount: '4000000000',
//                 denom: 'ustos',
//               },
//               delegator_address: delegatorAddress,
//               validator_address: validatorAddress,
//             },
//           },
//         ],
//       } as unknown as Types.TransactionMessage;

//       expect(spyNewStdMsg).toHaveBeenCalledWith(myTx);

//       spyGetBaseTx.mockRestore();
//       spyGetCosmos.mockRestore();
//       spyNewStdMsg.mockRestore();
//     });
//   });

//   describe('getWithdrawalRewardTx', () => {
//     it('returns a reward withdrawal tx', async () => {
//       const delegatorAddress = 'myAddress';
//       const validatorAddress = 'toAddress';

//       const baseTx = {
//         baseFoo: 'baseBar',
//       } as unknown as Types.BaseTransaction;

//       const spyGetBaseTx = jest.spyOn(Transactions, 'getBaseTx').mockImplementation(() => {
//         return Promise.resolve(baseTx);
//       });

//       const expectedMsgData = {
//         chain_id: '1',
//         barMsg: 'foo',
//         memo: '',
//       };

//       const fakeCosmos = {
//         newStdMsg: jest.fn(() => {
//           return expectedMsgData;
//         }),
//       } as unknown as Cosmos.CosmosInstance;

//       const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
//         return fakeCosmos;
//       });

//       const spyNewStdMsg = jest.spyOn(fakeCosmos, 'newStdMsg');

//       const withdrawalPayload = [
//         {
//           validatorAddress,
//         },
//       ];

//       const result = await Transactions.getWithdrawalRewardTx(delegatorAddress, withdrawalPayload);

//       expect(result).toStrictEqual(expectedMsgData);

//       const myTx = {
//         ...baseTx,
//         msgs: [
//           {
//             type: 'cosmos-sdk/MsgWithdrawDelegationReward',
//             value: {
//               delegator_address: delegatorAddress,
//               validator_address: validatorAddress,
//             },
//           },
//         ],
//       } as unknown as Types.TransactionMessage;

//       expect(spyNewStdMsg).toHaveBeenCalledWith(myTx);

//       spyGetBaseTx.mockRestore();
//       spyGetCosmos.mockRestore();
//       spyNewStdMsg.mockRestore();
//     });
//   });

//   describe('getWithdrawalAllRewardTx', () => {
//     it('returns a all reward withdrawal tx', async () => {
//       const delegatorAddress = 'myAddress';
//       const validatorAddress = 'toAddress';

//       const vListResult = {
//         data: [
//           {
//             address: validatorAddress,
//           },
//           {
//             address: 'anotherVlidatorAddress',
//           },
//         ],
//       } as ValidatorsTypes.ParsedValidatorsData;

//       const spyGetValidatorsBondedToDelegator = jest
//         .spyOn(ValidatorsApi, 'getValidatorsBondedToDelegator')
//         .mockImplementation(() => {
//           return Promise.resolve(vListResult);
//         });

//       const baseTx = {
//         baseFoo: 'baseBar',
//       } as unknown as Types.BaseTransaction;

//       const spyGetBaseTx = jest.spyOn(Transactions, 'getBaseTx').mockImplementation(() => {
//         return Promise.resolve(baseTx);
//       });

//       const expectedMsgData = {
//         chain_id: '1',
//         barMsg: 'foo',
//         memo: '',
//       };

//       const fakeCosmos = {
//         newStdMsg: jest.fn(() => {
//           return expectedMsgData;
//         }),
//       } as unknown as Cosmos.CosmosInstance;

//       const spyGetCosmos = jest.spyOn(Cosmos, 'getCosmos').mockImplementation(() => {
//         return fakeCosmos;
//       });

//       const spyNewStdMsg = jest.spyOn(fakeCosmos, 'newStdMsg');

//       const result = await Transactions.getWithdrawalAllRewardTx(delegatorAddress);

//       expect(result).toStrictEqual(expectedMsgData);

//       const myTx = {
//         ...baseTx,
//         msgs: [
//           {
//             type: 'cosmos-sdk/MsgWithdrawDelegationReward',
//             value: {
//               delegator_address: delegatorAddress,
//               validator_address: validatorAddress,
//             },
//           },
//           {
//             type: 'cosmos-sdk/MsgWithdrawDelegationReward',
//             value: {
//               delegator_address: delegatorAddress,
//               validator_address: 'anotherVlidatorAddress',
//             },
//           },
//         ],
//       } as unknown as Types.TransactionMessage;

//       expect(spyGetValidatorsBondedToDelegator).toHaveBeenCalledWith(delegatorAddress);
//       expect(spyNewStdMsg).toHaveBeenCalledWith(myTx);

//       spyGetValidatorsBondedToDelegator.mockRestore();
//       spyGetBaseTx.mockRestore();
//       spyGetCosmos.mockRestore();
//       spyNewStdMsg.mockRestore();
//     });
//   });
// });
