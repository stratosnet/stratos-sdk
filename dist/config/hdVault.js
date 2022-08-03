"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptionIterations = exports.encryptionKeyLength = exports.kdfConfiguration = exports.keyPathPattern = exports.keyPath = exports.stratosTopDenom = exports.stratosDenom = exports.stratosPubkeyPrefix = exports.stratosAddressPrefix = exports.stratosCoinType = exports.bip39Password = exports.bip44purpose = exports.masterkey = void 0;
exports.masterkey = 'm/';
exports.bip44purpose = "44'/";
exports.bip39Password = '';
exports.stratosCoinType = "606'/0'/0/";
exports.stratosAddressPrefix = 'st';
exports.stratosPubkeyPrefix = 'stpub';
exports.stratosDenom = 'ustos';
exports.stratosTopDenom = 'stos';
exports.keyPath = "" + exports.masterkey + exports.bip44purpose + exports.stratosCoinType;
exports.keyPathPattern = exports.keyPath + "a";
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
//# sourceMappingURL=hdVault.js.map