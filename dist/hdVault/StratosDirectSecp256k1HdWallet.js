"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeStratosHubPath = exports.pubkeyToRawAddressWithKeccak = void 0;
const amino_1 = require("@cosmjs/amino");
const crypto_1 = require("@cosmjs/crypto");
const encoding_1 = require("@cosmjs/encoding");
const encoding_2 = require("@cosmjs/encoding");
const proto_signing_1 = require("@cosmjs/proto-signing");
const stratosTypes = __importStar(require("@stratos-network/stratos-cosmosjs-types"));
const keccak_1 = __importDefault(require("keccak"));
const hdVault_1 = require("../config/hdVault");
function pubkeyToRawAddressWithKeccak(pubkey) {
    const pubkeyBuffer = Buffer.from(pubkey.slice(-64));
    const keccak256HashOfPubkeyBuffer = (0, keccak_1.default)('keccak256').update(pubkeyBuffer).digest();
    const fullRawAddress = new Uint8Array(keccak256HashOfPubkeyBuffer);
    const addressChunkOfBytes = fullRawAddress.slice(-20);
    const hexAddress = (0, encoding_1.toHex)(addressChunkOfBytes);
    console.log('hex address', hexAddress);
    const prefix = hdVault_1.stratosAddressPrefix;
    const address = (0, encoding_1.toBech32)(prefix, addressChunkOfBytes);
    console.log('bench32 address', address);
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
    prefix: 'cosmos',
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
        console.log('stratos DirectSecp256k1HdWallet  sign direct was called', signDoc);
        const account = accounts.find(({ address }) => address === signerAddress);
        if (account === undefined) {
            throw new Error(`Address ${signerAddress} not found in wallet`);
        }
        const { privkey, pubkey } = account;
        console.log('from DirectSecp256k1HdWallet - pubkey encoded - will be used to sign the doc ', pubkey);
        const pubkeyTest = (0, proto_signing_1.encodePubkey)((0, amino_1.encodeSecp256k1Pubkey)(pubkey));
        console.log('from DirectSecp256k1HdWallet - pubkeyTest (must mathch wit a legacy encoded pubkey)', pubkeyTest);
        const signBytes = (0, proto_signing_1.makeSignBytes)(signDoc);
        const hashedMessage = (0, crypto_1.sha256)(signBytes);
        const signature = await crypto_1.Secp256k1.createSignature(hashedMessage, privkey);
        // const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);
        const r32 = Array.from(signature.r(32));
        const s32 = Array.from(signature.s(32));
        const signatureBytes = new Uint8Array([...r32, ...s32]);
        // const signatureBytes = mergeUint8Arrays(signature.r(32), signature.s(32));
        const stdSignature = this.encodeSecp256k1Signature(pubkey, signatureBytes);
        return {
            signed: signDoc,
            signature: stdSignature,
        };
    }
    async serialize(password) {
        const kdfConfiguration = basicPasswordHashingOptions;
        const encryptionKey = await (0, proto_signing_1.executeKdf)(password, kdfConfiguration);
        return this.serializeWithEncryptionKey(encryptionKey, kdfConfiguration);
    }
    encodeSecp256k1Signature(pubkey, signature) {
        if (signature.length !== 64) {
            throw new Error('Signature must be 64 bytes long. Cosmos SDK uses a 2x32 byte fixed length encoding for the secp256k1 signature integers r and s.');
        }
        const StratosPubKey = stratosTypes.stratos.crypto.v1.ethsecp256k1.PubKey;
        const base64ofPubkey = (0, encoding_2.toBase64)(pubkey);
        const pubkeyEncodedStratos = {
            // type: '/stratos.crypto.v1.ethsecp256k1.PubKey' as const,
            type: 'stratos/PubKeyEthSecp256k1',
            value: base64ofPubkey,
        };
        console.log('from DirectSecp256k1HdWallet - pubkeyEncodedStratos (must have stratos type now)', pubkeyEncodedStratos);
        return {
            // pub_key: encodeSecp256k1Pubkey(pubkey),
            pub_key: pubkeyEncodedStratos,
            signature: (0, encoding_2.toBase64)(signature),
        };
    }
    // public async serializeWithEncryptionKey(
    //   encryptionKey: Uint8Array,
    //   kdfConfiguration: KdfConfiguration,
    // ): Promise<string> {
    //   console.log('encryptionKey', encryptionKey);
    //   console.log('kdfConfiguration', kdfConfiguration);
    //   return '';
    // const dataToEncrypt: DirectSecp256k1HdWalletData = {
    //   mnemonic: this.mnemonic,
    //   accounts: this.accounts.map(({ hdPath, prefix }) => ({
    //     hdPath: pathToString(hdPath),
    //     prefix: prefix,
    //   })),
    // };
    // const dataToEncryptRaw = toUtf8(JSON.stringify(dataToEncrypt));
    //
    // const encryptionConfiguration: EncryptionConfiguration = {
    //   algorithm: supportedAlgorithms.xchacha20poly1305Ietf,
    // };
    // const encryptedData = await encrypt(dataToEncryptRaw, encryptionKey, encryptionConfiguration);
    //
    // const out: DirectSecp256k1HdWalletSerialization = {
    //   type: serializationTypeV1,
    //   kdf: kdfConfiguration,
    //   encryption: encryptionConfiguration,
    //   data: toBase64(encryptedData),
    // };
    // return JSON.stringify(out);
    // }
    async getMyKeyPair(hdPath) {
        const { privkey } = crypto_1.Slip10.derivePath(crypto_1.Slip10Curve.Secp256k1, this.mySeed, hdPath);
        const { pubkey } = await crypto_1.Secp256k1.makeKeypair(privkey);
        const myKeypair = {
            privkey: privkey,
            pubkey: crypto_1.Secp256k1.compressPubkey(pubkey),
        };
        // console.log('stratos DirectSecp256k1HdWallet myKeypair', myKeypair);
        return myKeypair;
    }
    async getMyAccountsWithPrivkeys() {
        return Promise.all(this.myAccounts.map(async ({ hdPath, prefix }) => {
            const { privkey, pubkey } = await this.getMyKeyPair(hdPath);
            // console.log('stratos DirectSecp256k1HdWallet fullPubkeyHex 1', pubkey);
            const { pubkey: fullPubkey } = await crypto_1.Secp256k1.makeKeypair(privkey);
            const fullPubkeyHex = Buffer.from(fullPubkey).toString('hex');
            // console.log('fullPubkeyHex 2', fullPubkeyHex);
            const compressedPub = crypto_1.Secp256k1.compressPubkey(fullPubkey);
            const compressedPubHex = Buffer.from(compressedPub).toString('hex');
            console.log('from DirectSecp256k1HdWallet pub compressedPub ', compressedPub);
            console.log('from DirectSecp256k1HdWallet pub compressedPub compressedPubHex ', compressedPubHex);
            const addressOld = (0, encoding_1.toBech32)(prefix, (0, amino_1.rawSecp256k1PubkeyToRawAddress)(pubkey));
            const address = (0, encoding_1.toBech32)(prefix, pubkeyToRawAddressWithKeccak(fullPubkey));
            console.log('from DirectSecp256k1HdWallet old address ', addressOld);
            console.log('from DirectSecp256k1HdWallet new address ', address);
            return {
                algo: 'secp256k1',
                // algo: 'ed25519' as const,
                privkey: privkey,
                pubkey: pubkey,
                address: address,
            };
        }));
    }
}
exports.default = StratosDirectSecp256k1HdWallet;
// export default DirectSecp256k1HdWallet;
//# sourceMappingURL=StratosDirectSecp256k1HdWallet.js.map