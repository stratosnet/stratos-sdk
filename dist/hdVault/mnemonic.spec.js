"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mnemonic_1 = require("./mnemonic");
describe('convertStringToArray', () => {
    it('converts a string into a mnemonic array', () => {
        const str = 'one two';
        const data = (0, mnemonic_1.convertStringToArray)(str);
        expect(data.length).toEqual(2);
        const [first, second] = data;
        expect(first.word).toEqual('one');
        expect(second.word).toEqual('two');
    });
    it('creates a mnemonic aray, if an empty string is given', () => {
        const str = '';
        const data = (0, mnemonic_1.convertStringToArray)(str);
        expect(data.length).toEqual(1);
        const [{ index, word }] = data;
        expect(index).toEqual(1);
        expect(word).toEqual('');
    });
});
describe('generateMnemonicPhrase', () => {
    it('returns correct array of 24 mnemonic items', () => {
        const data = (0, mnemonic_1.generateMnemonicPhrase)(24);
        expect(data.length).toEqual(24);
        const [first] = data;
        const last = data[23];
        expect(first.index).toEqual(1);
        expect(last.index).toEqual(24);
    });
    it('returns correct array of 12 mnemonic items', () => {
        const data = (0, mnemonic_1.generateMnemonicPhrase)(12);
        expect(data.length).toEqual(12);
        const [first] = data;
        const last = data[11];
        expect(first.index).toEqual(1);
        expect(last.index).toEqual(12);
    });
});
describe('convertArrayToString', () => {
    it('converts mnenmonic array into a string', () => {
        const mnenmonicArray = [
            { index: 1, word: 'foo' },
            { index: 2, word: 'bar' },
        ];
        const data = (0, mnemonic_1.convertArrayToString)(mnenmonicArray);
        expect(data).toEqual('foo bar');
    });
});
describe('verifyPhrase', () => {
    it('verifies incorrect mnemonic array', () => {
        const mnenmonicArray = [
            { index: 1, word: 'foo' },
            { index: 2, word: 'bar' },
        ];
        const result = (0, mnemonic_1.verifyPhrase)(mnenmonicArray);
        expect(result).toEqual(false);
    });
    it('verifies correct mnemonic array', () => {
        const mnenmonicArray = [
            { index: 1, word: 'word' },
            { index: 2, word: 'winner' },
            { index: 3, word: 'can' },
            { index: 4, word: 'diagram' },
            { index: 5, word: 'skin' },
            { index: 6, word: 'fold' },
            { index: 7, word: 'topple' },
            { index: 8, word: 'man' },
            { index: 9, word: 'alert' },
            { index: 10, word: 'convince' },
            { index: 11, word: 'wool' },
            { index: 12, word: 'bulk' },
        ];
        const result = (0, mnemonic_1.verifyPhrase)(mnenmonicArray);
        expect(result).toEqual(true);
    });
});
//# sourceMappingURL=mnemonic.spec.js.map