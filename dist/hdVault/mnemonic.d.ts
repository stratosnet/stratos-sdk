declare const mnemonic12 = 12;
declare const mnemonic24 = 24;
interface MnemonicItem {
    readonly word: string;
    readonly index: number;
}
export declare type MnemonicPhrase = MnemonicItem[];
declare type MnemonicLength = typeof mnemonic12 | typeof mnemonic24;
export declare const convertArrayToString: (mnemonicArray: MnemonicPhrase) => string;
export declare const convertStringToArray: (mnemonicStr: string) => MnemonicPhrase;
export declare const generateMnemonicPhrase: (phraseLength: MnemonicLength) => MnemonicPhrase;
export declare const verifyPhrase: (phrase: MnemonicPhrase) => boolean;
export {};
