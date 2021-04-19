import { mnemonic } from './hdVault';
import { Random } from './random';

const data = Random.getBytes(12);

console.log('our data is:', data);

const phrase = mnemonic.generateMnemonicPhrase(24);

console.log('phrase', phrase);
