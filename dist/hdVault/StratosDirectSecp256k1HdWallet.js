"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeStratosHubPath = exports.pubkeyToRawAddressWithKeccak = void 0;
// import { rawSecp256k1PubkeyToRawAddress } from '@cosmjs/amino';
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const encoding_2 = require("@cosmjs/encoding");
const proto_signing_1 = require("@cosmjs/proto-signing");
const keccak_1 = __importDefault(require("keccak"));
const hdVault_1 = require("../config/hdVault");
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
function makeStratosHubPath(a) {
    return [
        crypto_1.Slip10RawIndex.hardened(44),
        crypto_1.Slip10RawIndex.hardened(606),
        crypto_1.Slip10RawIndex.hardened(0),
        crypto_1.Slip10RawIndex.normal(0),
        crypto_1.Slip10RawIndex.normal(a),
    ];
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
const defaultOptions = {
    bip39Password: '',
    hdPaths: [makeStratosHubPath(0)],
    prefix: hdVault_1.stratosAddressPrefix,
};
class StratosDirectSecp256k1HdWallet extends proto_signing_1.DirectSecp256k1HdWallet {
    static async fromMnemonic(mnemonic, options = {}) {
        const mnemonicChecked = new crypto_1.EnglishMnemonic(mnemonic);
        const seed = await crypto_1.Bip39.mnemonicToSeed(mnemonicChecked, options.bip39Password);
        return new StratosDirectSecp256k1HdWallet(mnemonicChecked, Object.assign(Object.assign({}, options), { seed: seed }));
    }
    constructor(mnemonic, options) {
        var _a, _b;
        const prefix = (_a = options.prefix) !== null && _a !== void 0 ? _a : defaultOptions.prefix;
        const hdPaths = (_b = options.hdPaths) !== null && _b !== void 0 ? _b : defaultOptions.hdPaths;
        super(mnemonic, options);
        this.mySecret = mnemonic;
        this.mySeed = options.seed;
        this.myAccounts = hdPaths.map(hdPath => ({
            hdPath: hdPath,
            prefix: prefix,
        }));
    }
    get mnemonic() {
        return this.mySecret.toString();
    }
    async getAccounts() {
        console.log('stratos DirectSecp256k1HdWallet  getAccounts was called');
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
        // console.log('from DirectSecp256k1HdWallet - pubkey encoded - will be used to sign the doc ', pubkey);
        //
        // console.log('yyyyy1 pkey ', privkey);
        // console.log('xxxxx1 pkey ', toHex(privkey));
        //
        // const params = {
        //   chainId: 12,
        //   account: signerAddress,
        //   rpcUrl: 'https://rpc-dev.thestratos.org',
        //   privateStr: toHex(privkey),
        // };
        // const signedTest = await signTxWithEth(signerAddress, '124', params);
        // console.log('signedTest', signedTest);
        // console.log('BBB signDoc', signDoc);
        const signBytes = (0, proto_signing_1.makeSignBytes)(signDoc);
        // console.log('BBB signBytes', Uint8Array.from(signBytes));
        // console.dir(Uint8Array.from(signBytes), { maxArrayLength: null });
        const signBytesBuffer = Buffer.from(signBytes);
        const keccak256HashOfSigningBytes = (0, keccak_1.default)('keccak256').update(signBytesBuffer).digest();
        const signBytesWithKeccak = new Uint8Array(keccak256HashOfSigningBytes);
        // console.log('BBB signBytesWithKeccak', signBytesWithKeccak);
        const hashedMessage = signBytesWithKeccak;
        // const hashedMessage = sha256(signBytes);
        // console.log('BBB hashedMessage', hashedMessage);
        const signature = await crypto_1.Secp256k1.createSignature(hashedMessage, privkey);
        // console.log('BBBA cosmojs/crypto signature created by Secp256k1.createSignature(', signature);
        // const signatureToTest = secp256k1.ecdsaSign(hashedMessage, privkey);
        // console.log('BBBA signature by secp256k1.ecdsaSign ', signatureToTest);
        const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);
        // console.log('BBBA signatureBytes from Secp256k1.createSignature ', signatureBytes);
        const stdSignature = this.encodeSecp256k1Signature(pubkey, signatureBytes);
        // console.log('BBBA stdSignature', stdSignature);
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
        // console.log('from DirectSecp256k1HdWallet - pubkey from encode', pubkey);
        // console.log('from DirectSecp256k1HdWallet - signature from encode', signature);
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
        const { privkey } = crypto_1.Slip10.derivePath(crypto_1.Slip10Curve.Secp256k1, this.mySeed, hdPath);
        const { pubkey } = await crypto_1.Secp256k1.makeKeypair(privkey);
        const myKeypair = {
            privkey: privkey,
            pubkey: crypto_1.Secp256k1.compressPubkey(pubkey),
        };
        return myKeypair;
    }
    async getMyAccountsWithPrivkeys() {
        return Promise.all(this.myAccounts.map(async ({ hdPath, prefix }) => {
            const { privkey, pubkey } = await this.getMyKeyPair(hdPath);
            // console.log('stratos DirectSecp256k1HdWallet fullPubkeyHex 1', pubkey);
            const { pubkey: fullPubkey } = await crypto_1.Secp256k1.makeKeypair(privkey);
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