"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxHdPathKeyindex = exports.encryptionIterations = exports.encryptionKeyLength = exports.kdfConfiguration = exports.keyPathPattern = exports.keyPath = exports.stratosOzDenom = exports.stratosUozDenom = exports.stratosTopDenom = exports.stratosDenom = exports.stratosPubkeyPrefix = exports.stratosAddressPrefix = exports.stratosCoinType = exports.bip44purpose = exports.slip10RawIndexes = exports.masterkey = exports.bip39Password = void 0;
exports.bip39Password = '';
exports.masterkey = 'm/';
exports.slip10RawIndexes = [44, 606, 0, 0];
// bip44purpose = "44'/";
exports.bip44purpose = `${exports.slip10RawIndexes[0]}'/`;
// stratosCoinType = "606'/0'/0/";
exports.stratosCoinType = `${exports.slip10RawIndexes[1]}'/${exports.slip10RawIndexes[2]}'/${exports.slip10RawIndexes[3]}/`;
exports.stratosAddressPrefix = 'st';
exports.stratosPubkeyPrefix = 'stpub';
// export const stratosDenom = 'ustos';
exports.stratosDenom = 'wei';
exports.stratosTopDenom = 'stos';
exports.stratosUozDenom = 'uoz';
exports.stratosOzDenom = 'oz';
exports.keyPath = `${exports.masterkey}${exports.bip44purpose}${exports.stratosCoinType}`;
exports.keyPathPattern = `${exports.keyPath}a`;
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