"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mnemonic_1 = require("./mnemonic");
describe('convertStringToArray', function () {
    it('converts a string into a mnemonic array', function () {
        var str = 'one two';
        var data = (0, mnemonic_1.convertStringToArray)(str);
        expect(data.length).toEqual(2);
        var first = data[0], second = data[1];
        expect(first.word).toEqual('one');
        expect(second.word).toEqual('two');
    });
    it('creates a mnemonic aray, if an empty string is given', function () {
        var str = '';
        var data = (0, mnemonic_1.convertStringToArray)(str);
        expect(data.length).toEqual(1);
        var _a = data[0], index = _a.index, word = _a.word;
        expect(index).toEqual(1);
        expect(word).toEqual('');
    });
});
describe('generateMnemonicPhrase', function () {
    it('returns correct array of 24 mnemonic items', function () {
        var data = (0, mnemonic_1.generateMnemonicPhrase)(24);
        expect(data.length).toEqual(24);
        var first = data[0];
        var last = data[23];
        expect(first.index).toEqual(1);
        expect(last.index).toEqual(24);
    });
    it('returns correct array of 12 mnemonic items', function () {
        var data = (0, mnemonic_1.generateMnemonicPhrase)(12);
        expect(data.length).toEqual(12);
        var first = data[0];
        var last = data[11];
        expect(first.index).toEqual(1);
        expect(last.index).toEqual(12);
    });
});
describe('convertArrayToString', function () {
    it('converts mnenmonic array into a string', function () {
        var mnenmonicArray = [
            { index: 1, word: 'foo' },
            { index: 2, word: 'bar' },
        ];
        var data = (0, mnemonic_1.convertArrayToString)(mnenmonicArray);
        expect(data).toEqual('foo bar');
    });
});
describe('verifyPhrase', function () {
    it('verifies incorrect mnemonic array', function () {
        var mnenmonicArray = [
            { index: 1, word: 'foo' },
            { index: 2, word: 'bar' },
        ];
        var result = (0, mnemonic_1.verifyPhrase)(mnenmonicArray);
        expect(result).toEqual(false);
    });
    it('verifies correct mnemonic array', function () {
        var mnenmonicArray = [
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
        var result = (0, mnemonic_1.verifyPhrase)(mnenmonicArray);
        expect(result).toEqual(true);
    });
});
//# sourceMappingURL=mnemonic.spec.js.map