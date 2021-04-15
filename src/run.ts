import { mnemonic, wallet } from './hdVault';
import { Random } from './random';

const data = Random.getBytes(12);

console.log('our data is:', data);

const dummyKey = wallet.deriveMasterKey(123);

console.log('dummyKey', dummyKey);

const phrase = mnemonic.generateMnemonicPhrase(24);

console.log('phrase', phrase);
