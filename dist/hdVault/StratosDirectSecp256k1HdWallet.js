"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultOptions = exports.makeStratosHubPath = exports.pubkeyToRawAddressWithKeccak = void 0;
const crypto_2 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const encoding_2 = require("@cosmjs/encoding");
const proto_signing_1 = require("@cosmjs/proto-signing");
const keccak_1 = __importDefault(require("keccak"));
const hdVault_1 = require("../config/hdVault");
const Sdk_1 = __importDefault(require("../Sdk"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto_1 = require('@cosmjs/crypto');
function pubkeyToRawAddressWithKeccak(pubkey) {
    const pubkeyBuffer = Buffer.from(pubkey.slice(-64));
    const keccak256HashOfPubkeyBuffer = (0, keccak_1.default)('keccak256').update(pubkeyBuffer).digest();
    const fullRawAddress = new Uint8Array(keccak256HashOfPubkeyBuffer);
    const addressChunkOfBytes = fullRawAddress.slice(-20);
    // const hexAddress = toHex(addressChunkOfBytes);
    // console.log('hex address', hexAddress);
    // const prefix = stratosAddressPrefix;
    // const address = toBech32(prefix, addressChunkOfBytes);
    // console.log('bench32 address', address);
    return addressChunkOfBytes;
}
exports.pubkeyToRawAddressWithKeccak = pubkeyToRawAddressWithKeccak;
/**
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
function makeStratosHubPath(a) {
    const { keyPathParameters } = Sdk_1.default.environment;
    const defaultPath = [
        crypto_2.Slip10RawIndex.hardened(hdVault_1.slip10RawIndexes[0]),
        crypto_2.Slip10RawIndex.hardened(hdVault_1.slip10RawIndexes[1]),
        crypto_2.Slip10RawIndex.hardened(hdVault_1.slip10RawIndexes[2]),
        crypto_2.Slip10RawIndex.normal(hdVault_1.slip10RawIndexes[3]),
        crypto_2.Slip10RawIndex.normal(a),
    ];
    if (!keyPathParameters) {
        return defaultPath;
    }
    const { slip10RawIndexes: slip10RawIndexesToUse } = keyPathParameters;
    try {
        console.log('using slip10RawIndexesToUse', slip10RawIndexesToUse);
        return [
            crypto_2.Slip10RawIndex.hardened(slip10RawIndexesToUse[0]),
            crypto_2.Slip10RawIndex.hardened(slip10RawIndexesToUse[1]),
            crypto_2.Slip10RawIndex.hardened(slip10RawIndexesToUse[2]),
            crypto_2.Slip10RawIndex.normal(slip10RawIndexesToUse[3]),
            crypto_2.Slip10RawIndex.normal(a),
        ];
    }
    catch (error) {
        console.log('could not parse  keyPathParameters from sdk', keyPathParameters);
        return defaultPath;
    }
}
exports.makeStratosHubPath = makeStratosHubPath;
const basicPasswordHashingOptions = {
    algorithm: 'argon2id',
    params: {
        outputLength: 32,
        opsLimit: 24,
        memLimitKib: 12 * 1024,
    },
};
exports.defaultOptions = {
    bip39Password: (0, hdVault_1.bip39Password)((_a = Sdk_1.default.environment.keyPathParameters) === null || _a === void 0 ? void 0 : _a.bip39Password),
    hdPaths: [makeStratosHubPath(0)],
    prefix: hdVault_1.stratosAddressPrefix,
};
class StratosDirectSecp256k1HdWallet extends proto_signing_1.DirectSecp256k1HdWallet {
    static async fromMnemonic(mnemonic, options = {}) {
        const mnemonicChecked = new crypto_2.EnglishMnemonic(mnemonic);
        const seed = await crypto_2.Bip39.mnemonicToSeed(mnemonicChecked, options.bip39Password);
        return new StratosDirectSecp256k1HdWallet(mnemonicChecked, Object.assign(Object.assign({}, options), { seed: seed }));
    }
    constructor(mnemonic, options) {
        var _a, _b;
        const prefix = (_a = options.prefix) !== null && _a !== void 0 ? _a : exports.defaultOptions.prefix;
        const hdPaths = (_b = options.hdPaths) !== null && _b !== void 0 ? _b : exports.defaultOptions.hdPaths;
        super(mnemonic, options);
        this.mySecret = mnemonic;
        this.mySeed = options.seed;
        const a = hdPaths.map(hdPath => ({
            hdPath: hdPath,
            prefix: prefix,
        }));
        this.myAccounts = a;
    }
    get mnemonic() {
        return this.mySecret.toString();
    }
    async getAccounts() {
        // console.log('stratos DirectSecp256k1HdWallet  getAccounts was called');
        const accountsWithPrivkeys = await this.getMyAccountsWithPrivkeys();
        return accountsWithPrivkeys.map(({ algo, pubkey, address }) => ({
            algo: algo,
            pubkey: pubkey,
            address: address,
        }));
    }
    async signDirect(signerAddress, signDoc) {
        const accounts = await this.getMyAccountsWithPrivkeys();
        // console.log('stratos DirectSecp256k1HdWallet  sign direct was called', signDoc);
        const account = accounts.find(({ address }) => address === signerAddress);
        if (account === undefined) {
            throw new Error(`Address ${signerAddress} not found in wallet`);
        }
        const { privkey, pubkey } = account;
        const signBytes = (0, proto_signing_1.makeSignBytes)(signDoc);
        const signBytesBuffer = Buffer.from(signBytes);
        const keccak256HashOfSigningBytes = (0, keccak_1.default)('keccak256').update(signBytesBuffer).digest();
        const signBytesWithKeccak = new Uint8Array(keccak256HashOfSigningBytes);
        const hashedMessage = signBytesWithKeccak;
        // const hashedMessage = sha256(signBytes);
        const signature = await crypto_2.Secp256k1.createSignature(hashedMessage, privkey);
        const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);
        const stdSignature = this.encodeSecp256k1Signature(pubkey, signatureBytes);
        return {
            signed: signDoc,
            signature: stdSignature,
        };
    }
    encodeSecp256k1Signature(pubkey, signature) {
        if (signature.length !== 64) {
            throw new Error('Signature must be 64 bytes long. Cosmos SDK uses a 2x32 byte fixed length encoding for the secp256k1 signature integers r and s.');
        }
        const base64ofPubkey = (0, encoding_2.toBase64)(pubkey);
        const pubkeyEncodedStratos = {
            type: '/stratos.crypto.v1.ethsecp256k1.PubKey',
            value: base64ofPubkey,
        };
        // console.log(
        //   'from DirectSecp256k1HdWallet - pubkeyEncodedStratos (must have stratos type now)',
        //   pubkeyEncodedStratos,
        // );
        return {
            pub_key: pubkeyEncodedStratos,
            signature: (0, encoding_2.toBase64)(signature),
        };
    }
    async serialize(password) {
        const kdfConfiguration = basicPasswordHashingOptions;
        const encryptionKey = await (0, proto_signing_1.executeKdf)(password, kdfConfiguration);
        return this.serializeWithEncryptionKey(encryptionKey, kdfConfiguration);
    }
    async getMyKeyPair(hdPath) {
        const { privkey } = crypto_2.Slip10.derivePath(crypto_2.Slip10Curve.Secp256k1, this.mySeed, hdPath);
        const { pubkey } = await crypto_2.Secp256k1.makeKeypair(privkey);
        const myKeypair = {
            privkey: privkey,
            pubkey: crypto_2.Secp256k1.compressPubkey(pubkey),
        };
        return myKeypair;
    }
    async getMyAccountsWithPrivkeys() {
        return Promise.all(this.myAccounts.map(async ({ hdPath, prefix }) => {
            const { privkey, pubkey } = await this.getMyKeyPair(hdPath);
            // console.log('stratos DirectSecp256k1HdWallet fullPubkeyHex 1', pubkey);
            const { pubkey: fullPubkey } = await crypto_2.Secp256k1.makeKeypair(privkey);
            // const fullPubkeyHex = Buffer.from(fullPubkey).toString('hex');
            // const compressedPub = Secp256k1.compressPubkey(fullPubkey);
            // const compressedPubHex = Buffer.from(compressedPub).toString('hex');
            // console.log('from DirectSecp256k1HdWallet pub compressedPub ', compressedPub);
            // console.log('from DirectSecp256k1HdWallet pub compressedPub compressedPubHex ', compressedPubHex);
            // const addressOld = toBech32(prefix, rawSecp256k1PubkeyToRawAddress(pubkey));
            const address = (0, encoding_1.toBech32)(prefix, pubkeyToRawAddressWithKeccak(fullPubkey));
            // console.log('from DirectSecp256k1HdWallet old address ', addressOld);
            // console.log('from DirectSecp256k1HdWallet new address ', address);
            return {
                algo: 'secp256k1',
                privkey: privkey,
                pubkey: pubkey,
                address: address,
            };
        }));
    }
}
exports.default = StratosDirectSecp256k1HdWallet;
//# sourceMappingURL=StratosDirectSecp256k1HdWallet.js.map