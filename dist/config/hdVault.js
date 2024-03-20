"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxHdPathKeyindex = exports.encryptionIterations = exports.encryptionKeyLength = exports.kdfConfiguration = exports.stratosOzDenom = exports.stratosUozDenom = exports.stratosTopDenom = exports.stratosDenom = exports.stratosPubkeyPrefix = exports.stratosAddressPrefix = exports.keyPath = exports.stratosCoinType = exports.bip44purpose = exports.masterkey = exports.slip10RawIndexes = exports.bip39Password = void 0;
const bip39Password = (givenP) => (givenP ? `${givenP}` : '');
exports.bip39Password = bip39Password;
exports.slip10RawIndexes = [44, 606, 0, 0];
// export const masterkey = 'm/';
const masterkey = (givenM) => (givenM ? `${givenM}/` : 'm/');
exports.masterkey = masterkey;
// bip44purpose = "44'/";
// export const bip44purpose = `${slip10RawIndexes[0]}'/`;
const bip44purpose = (slipList = exports.slip10RawIndexes) => `${slipList[0]}'/`;
exports.bip44purpose = bip44purpose;
// stratosCoinType = "606'/0'/0/";
// export const stratosCoinType = `${slip10RawIndexes[1]}'/${slip10RawIndexes[2]}'/${slip10RawIndexes[3]}/`;
const stratosCoinType = (slipList = exports.slip10RawIndexes) => `${slipList[1]}'/${slipList[2]}'/${slipList[3]}/`;
exports.stratosCoinType = stratosCoinType;
// fullKeyPath: "'m/44'/606'/0'/0/",
// export const keyPath = `${masterkey}${bip44purpose}${stratosCoinType}`;
const keyPath = (slipList = exports.slip10RawIndexes, givenM) => `${(0, exports.masterkey)(givenM)}${(0, exports.bip44purpose)(slipList)}${(0, exports.stratosCoinType)(slipList)}`;
exports.keyPath = keyPath;
exports.stratosAddressPrefix = 'st';
exports.stratosPubkeyPrefix = 'stpub';
// export const stratosDenom = 'ustos';
exports.stratosDenom = 'wei';
exports.stratosTopDenom = 'stos';
exports.stratosUozDenom = 'uoz';
exports.stratosOzDenom = 'oz';
// export const keyPathPattern = `${keyPath}a`;
exports.kdfConfiguration = {
    algorithm: 'argon2id',
    params: {
        outputLength: 32,
        opsLimit: 24,
        memLimitKib: 12 * 1024,
    },
};
exports.encryptionKeyLength = 32;
exports.encryptionIterations = 10000;
exports.maxHdPathKeyindex = 65535;
//# sourceMappingURL=hdVault.js.map