"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPhrase = exports.generateMnemonicPhrase = exports.convertStringToArray = exports.convertArrayToString = void 0;
const bip39_1 = require("bip39");
// import crypto from 'crypto';
const mnemonic12 = 12;
const mnemonic24 = 24;
const convertArrayToString = (mnemonicArray) => {
    return mnemonicArray.map(({ word = '' }) => word).join(' ');
};
exports.convertArrayToString = convertArrayToString;
const convertStringToArray = (mnemonicStr) => {
    const mnemonicArray = mnemonicStr.split(' ');
    return mnemonicArray.map((word, idx) => ({ index: idx + 1, word }));
};
exports.convertStringToArray = convertStringToArray;
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
//   // another way:
//   // const mnemonic = Bip39.encode(Random.getBytes(16)).toString(); // using { Bip39 } '@cosmjs/crypto'
//
//   return convertStringToArray(mnemonicString);
// };
const generateMnemonicPhrase = (phraseLength) => {
    let strength = 128; // Default to 12 words
    console.log('hey!1');
    if (phraseLength === mnemonic24) {
        console.log('hey!2');
        strength = 256; // 24 words
    }
    console.log('hey!3');
    const mnemonicString = (0, bip39_1.generateMnemonic)(strength);
    console.log('hey!4');
    return (0, exports.convertStringToArray)(mnemonicString);
};
exports.generateMnemonicPhrase = generateMnemonicPhrase;
const verifyPhrase = (phrase) => {
    return (0, bip39_1.validateMnemonic)((0, exports.convertArrayToString)(phrase), bip39_1.wordlists.english);
};
exports.verifyPhrase = verifyPhrase;
//# sourceMappingURL=mnemonic.js.map