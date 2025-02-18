import { generateMnemonic, validateMnemonic, wordlists } from 'bip39';

// import crypto from 'crypto';

const mnemonic12 = 12;
const mnemonic24 = 24;

interface MnemonicItem {
  readonly word: string;
  readonly index: number;
}

export type MnemonicPhrase = MnemonicItem[];

type MnemonicLength = typeof mnemonic12 | typeof mnemonic24;

export const convertArrayToString = (mnemonicArray: MnemonicPhrase): string => {
  return mnemonicArray.map(({ word = '' }) => word).join(' ');
};

export const convertStringToArray = (mnemonicStr: string): MnemonicPhrase => {
  const mnemonicArray = mnemonicStr.split(' ');
  return mnemonicArray.map((word: string, idx: number): MnemonicItem => ({ index: idx + 1, word }));
};

// export const generateMnemonicPhrase = (phraseLength: MnemonicLength): MnemonicPhrase => {
//   let mnemonicString = '';
//
//   if (phraseLength === mnemonic12) {
//     mnemonicString = generateMnemonic();
//     return convertStringToArray(mnemonicString);
//   }
//
//   const entropy = crypto.randomBytes(32);
//   mnemonicString = entropyToMnemonic(entropy);
//
//   return convertStringToArray(mnemonicString);
// };

export const generateMnemonicPhrase = (phraseLength: MnemonicLength): MnemonicPhrase => {
  let strength = 128; // Default to 12 words

  console.log('hey!1');

  if (phraseLength === mnemonic24) {
    console.log('hey!2');
    strength = 256; // 24 words
  }

  console.log('hey!3');
  const mnemonicString = generateMnemonic(strength);

  console.log('hey!4');
  return convertStringToArray(mnemonicString);
};

export const verifyPhrase = (phrase: MnemonicPhrase): boolean => {
  return validateMnemonic(convertArrayToString(phrase), wordlists.english);
};
