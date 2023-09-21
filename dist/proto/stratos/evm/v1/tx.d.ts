import { Any } from 'cosmjs-types/google/protobuf/any';
import _m0 from 'protobufjs/minimal';
import { AccessTuple, Log } from './evm';
export declare const protobufPackage = "stratos.evm.v1";
/** MsgEthereumTx encapsulates an Ethereum transaction as an SDK message. */
export interface MsgEthereumTx {
    /** inner transaction data */
    data: Any | undefined;
    /** encoded storage size of the transaction */
    size: number;
    /** transaction hash in hex format */
    hash: string;
    /**
     * ethereum signer address in hex format. This address value is checked
     * against the address derived from the signature (V, R, S) using the
     * secp256k1 elliptic curve
     */
    from: string;
}
/** LegacyTx is the transaction data of regular Ethereum transactions. */
export interface LegacyTx {
    /** nonce corresponds to the account nonce (transaction sequence). */
    nonce: number;
    /** gas price defines the value for each gas unit */
    gasPrice: string;
    /** gas defines the gas limit defined for the transaction. */
    gas: number;
    /** hex formatted address of the recipient */
    to: string;
    /** value defines the unsigned integer value of the transaction amount. */
    value: string;
    /** input defines the data payload bytes of the transaction. */
    data: Uint8Array;
    /** v defines the signature value */
    v: Uint8Array;
    /** r defines the signature value */
    r: Uint8Array;
    /** s define the signature value */
    s: Uint8Array;
}
/** AccessListTx is the data of EIP-2930 access list transactions. */
export interface AccessListTx {
    /** destination EVM chain ID */
    chainId: string;
    /** nonce corresponds to the account nonce (transaction sequence). */
    nonce: number;
    /** gas price defines the value for each gas unit */
    gasPrice: string;
    /** gas defines the gas limit defined for the transaction. */
    gas: number;
    /** hex formatted address of the recipient */
    to: string;
    /** value defines the unsigned integer value of the transaction amount. */
    value: string;
    /** input defines the data payload bytes of the transaction. */
    data: Uint8Array;
    accesses: AccessTuple[];
    /** v defines the signature value */
    v: Uint8Array;
    /** r defines the signature value */
    r: Uint8Array;
    /** s define the signature value */
    s: Uint8Array;
}
/** DynamicFeeTx is the data of EIP-1559 dinamic fee transactions. */
export interface DynamicFeeTx {
    /** destination EVM chain ID */
    chainId: string;
    /** nonce corresponds to the account nonce (transaction sequence). */
    nonce: number;
    /** gas tip cap defines the max value for the gas tip */
    gasTipCap: string;
    /** gas fee cap defines the max value for the gas fee */
    gasFeeCap: string;
    /** gas defines the gas limit defined for the transaction. */
    gas: number;
    /** hex formatted address of the recipient */
    to: string;
    /** value defines the the transaction amount. */
    value: string;
    /** input defines the data payload bytes of the transaction. */
    data: Uint8Array;
    accesses: AccessTuple[];
    /** v defines the signature value */
    v: Uint8Array;
    /** r defines the signature value */
    r: Uint8Array;
    /** s define the signature value */
    s: Uint8Array;
}
export interface ExtensionOptionsEthereumTx {
}
/** MsgEthereumTxResponse defines the Msg/EthereumTx response type. */
export interface MsgEthereumTxResponse {
    /**
     * ethereum transaction hash in hex format. This hash differs from the
     * Tendermint sha256 hash of the transaction bytes. See
     * https://github.com/tendermint/tendermint/issues/6539 for reference
     */
    hash: string;
    /**
     * logs contains the transaction hash and the proto-compatible ethereum
     * logs.
     */
    logs: Log[];
    /**
     * returned data from evm function (result or data supplied with revert
     * opcode)
     */
    ret: Uint8Array;
    /** vm error is the error returned by vm execution */
    vmError: string;
    /** gas consumed by the transaction */
    gasUsed: number;
}
export declare const MsgEthereumTx: {
    encode(message: MsgEthereumTx, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgEthereumTx;
    fromJSON(object: any): MsgEthereumTx;
    toJSON(message: MsgEthereumTx): unknown;
    create<I extends {
        data?: {
            typeUrl?: string | undefined;
            value?: Uint8Array | undefined;
        } | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        from?: string | undefined;
    } & {
        data?: ({
            typeUrl?: string | undefined;
            value?: Uint8Array | undefined;
        } & {
            typeUrl?: string | undefined;
            value?: Uint8Array | undefined;
        } & { [K in Exclude<keyof I["data"], keyof Any>]: never; }) | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        from?: string | undefined;
    } & { [K_1 in Exclude<keyof I, keyof MsgEthereumTx>]: never; }>(base?: I | undefined): MsgEthereumTx;
    fromPartial<I_1 extends {
        data?: {
            typeUrl?: string | undefined;
            value?: Uint8Array | undefined;
        } | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        from?: string | undefined;
    } & {
        data?: ({
            typeUrl?: string | undefined;
            value?: Uint8Array | undefined;
        } & {
            typeUrl?: string | undefined;
            value?: Uint8Array | undefined;
        } & { [K_2 in Exclude<keyof I_1["data"], keyof Any>]: never; }) | undefined;
        size?: number | undefined;
        hash?: string | undefined;
        from?: string | undefined;
    } & { [K_3 in Exclude<keyof I_1, keyof MsgEthereumTx>]: never; }>(object: I_1): MsgEthereumTx;
};
export declare const LegacyTx: {
    encode(message: LegacyTx, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): LegacyTx;
    fromJSON(object: any): LegacyTx;
    toJSON(message: LegacyTx): unknown;
    create<I extends {
        nonce?: number | undefined;
        gasPrice?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & {
        nonce?: number | undefined;
        gasPrice?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & { [K in Exclude<keyof I, keyof LegacyTx>]: never; }>(base?: I | undefined): LegacyTx;
    fromPartial<I_1 extends {
        nonce?: number | undefined;
        gasPrice?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & {
        nonce?: number | undefined;
        gasPrice?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & { [K_1 in Exclude<keyof I_1, keyof LegacyTx>]: never; }>(object: I_1): LegacyTx;
};
export declare const AccessListTx: {
    encode(message: AccessListTx, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): AccessListTx;
    fromJSON(object: any): AccessListTx;
    toJSON(message: AccessListTx): unknown;
    create<I extends {
        chainId?: string | undefined;
        nonce?: number | undefined;
        gasPrice?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        accesses?: {
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[] | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & {
        chainId?: string | undefined;
        nonce?: number | undefined;
        gasPrice?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        accesses?: ({
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[] & ({
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        } & {
            address?: string | undefined;
            storageKeys?: (string[] & string[] & { [K in Exclude<keyof I["accesses"][number]["storageKeys"], keyof string[]>]: never; }) | undefined;
        } & { [K_1 in Exclude<keyof I["accesses"][number], keyof AccessTuple>]: never; })[] & { [K_2 in Exclude<keyof I["accesses"], keyof {
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[]>]: never; }) | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & { [K_3 in Exclude<keyof I, keyof AccessListTx>]: never; }>(base?: I | undefined): AccessListTx;
    fromPartial<I_1 extends {
        chainId?: string | undefined;
        nonce?: number | undefined;
        gasPrice?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        accesses?: {
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[] | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & {
        chainId?: string | undefined;
        nonce?: number | undefined;
        gasPrice?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        accesses?: ({
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[] & ({
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        } & {
            address?: string | undefined;
            storageKeys?: (string[] & string[] & { [K_4 in Exclude<keyof I_1["accesses"][number]["storageKeys"], keyof string[]>]: never; }) | undefined;
        } & { [K_5 in Exclude<keyof I_1["accesses"][number], keyof AccessTuple>]: never; })[] & { [K_6 in Exclude<keyof I_1["accesses"], keyof {
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[]>]: never; }) | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof AccessListTx>]: never; }>(object: I_1): AccessListTx;
};
export declare const DynamicFeeTx: {
    encode(message: DynamicFeeTx, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): DynamicFeeTx;
    fromJSON(object: any): DynamicFeeTx;
    toJSON(message: DynamicFeeTx): unknown;
    create<I extends {
        chainId?: string | undefined;
        nonce?: number | undefined;
        gasTipCap?: string | undefined;
        gasFeeCap?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        accesses?: {
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[] | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & {
        chainId?: string | undefined;
        nonce?: number | undefined;
        gasTipCap?: string | undefined;
        gasFeeCap?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        accesses?: ({
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[] & ({
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        } & {
            address?: string | undefined;
            storageKeys?: (string[] & string[] & { [K in Exclude<keyof I["accesses"][number]["storageKeys"], keyof string[]>]: never; }) | undefined;
        } & { [K_1 in Exclude<keyof I["accesses"][number], keyof AccessTuple>]: never; })[] & { [K_2 in Exclude<keyof I["accesses"], keyof {
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[]>]: never; }) | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & { [K_3 in Exclude<keyof I, keyof DynamicFeeTx>]: never; }>(base?: I | undefined): DynamicFeeTx;
    fromPartial<I_1 extends {
        chainId?: string | undefined;
        nonce?: number | undefined;
        gasTipCap?: string | undefined;
        gasFeeCap?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        accesses?: {
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[] | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & {
        chainId?: string | undefined;
        nonce?: number | undefined;
        gasTipCap?: string | undefined;
        gasFeeCap?: string | undefined;
        gas?: number | undefined;
        to?: string | undefined;
        value?: string | undefined;
        data?: Uint8Array | undefined;
        accesses?: ({
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[] & ({
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        } & {
            address?: string | undefined;
            storageKeys?: (string[] & string[] & { [K_4 in Exclude<keyof I_1["accesses"][number]["storageKeys"], keyof string[]>]: never; }) | undefined;
        } & { [K_5 in Exclude<keyof I_1["accesses"][number], keyof AccessTuple>]: never; })[] & { [K_6 in Exclude<keyof I_1["accesses"], keyof {
            address?: string | undefined;
            storageKeys?: string[] | undefined;
        }[]>]: never; }) | undefined;
        v?: Uint8Array | undefined;
        r?: Uint8Array | undefined;
        s?: Uint8Array | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof DynamicFeeTx>]: never; }>(object: I_1): DynamicFeeTx;
};
export declare const ExtensionOptionsEthereumTx: {
    encode(_: ExtensionOptionsEthereumTx, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ExtensionOptionsEthereumTx;
    fromJSON(_: any): ExtensionOptionsEthereumTx;
    toJSON(_: ExtensionOptionsEthereumTx): unknown;
    create<I extends {} & {} & { [K in Exclude<keyof I, never>]: never; }>(base?: I | undefined): ExtensionOptionsEthereumTx;
    fromPartial<I_1 extends {} & {} & { [K_1 in Exclude<keyof I_1, never>]: never; }>(_: I_1): ExtensionOptionsEthereumTx;
};
export declare const MsgEthereumTxResponse: {
    encode(message: MsgEthereumTxResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): MsgEthereumTxResponse;
    fromJSON(object: any): MsgEthereumTxResponse;
    toJSON(message: MsgEthereumTxResponse): unknown;
    create<I extends {
        hash?: string | undefined;
        logs?: {
            address?: string | undefined;
            topics?: string[] | undefined;
            data?: Uint8Array | undefined;
            blockNumber?: number | undefined;
            txHash?: string | undefined;
            txIndex?: number | undefined;
            blockHash?: string | undefined;
            index?: number | undefined;
            removed?: boolean | undefined;
        }[] | undefined;
        ret?: Uint8Array | undefined;
        vmError?: string | undefined;
        gasUsed?: number | undefined;
    } & {
        hash?: string | undefined;
        logs?: ({
            address?: string | undefined;
            topics?: string[] | undefined;
            data?: Uint8Array | undefined;
            blockNumber?: number | undefined;
            txHash?: string | undefined;
            txIndex?: number | undefined;
            blockHash?: string | undefined;
            index?: number | undefined;
            removed?: boolean | undefined;
        }[] & ({
            address?: string | undefined;
            topics?: string[] | undefined;
            data?: Uint8Array | undefined;
            blockNumber?: number | undefined;
            txHash?: string | undefined;
            txIndex?: number | undefined;
            blockHash?: string | undefined;
            index?: number | undefined;
            removed?: boolean | undefined;
        } & {
            address?: string | undefined;
            topics?: (string[] & string[] & { [K in Exclude<keyof I["logs"][number]["topics"], keyof string[]>]: never; }) | undefined;
            data?: Uint8Array | undefined;
            blockNumber?: number | undefined;
            txHash?: string | undefined;
            txIndex?: number | undefined;
            blockHash?: string | undefined;
            index?: number | undefined;
            removed?: boolean | undefined;
        } & { [K_1 in Exclude<keyof I["logs"][number], keyof Log>]: never; })[] & { [K_2 in Exclude<keyof I["logs"], keyof {
            address?: string | undefined;
            topics?: string[] | undefined;
            data?: Uint8Array | undefined;
            blockNumber?: number | undefined;
            txHash?: string | undefined;
            txIndex?: number | undefined;
            blockHash?: string | undefined;
            index?: number | undefined;
            removed?: boolean | undefined;
        }[]>]: never; }) | undefined;
        ret?: Uint8Array | undefined;
        vmError?: string | undefined;
        gasUsed?: number | undefined;
    } & { [K_3 in Exclude<keyof I, keyof MsgEthereumTxResponse>]: never; }>(base?: I | undefined): MsgEthereumTxResponse;
    fromPartial<I_1 extends {
        hash?: string | undefined;
        logs?: {
            address?: string | undefined;
            topics?: string[] | undefined;
            data?: Uint8Array | undefined;
            blockNumber?: number | undefined;
            txHash?: string | undefined;
            txIndex?: number | undefined;
            blockHash?: string | undefined;
            index?: number | undefined;
            removed?: boolean | undefined;
        }[] | undefined;
        ret?: Uint8Array | undefined;
        vmError?: string | undefined;
        gasUsed?: number | undefined;
    } & {
        hash?: string | undefined;
        logs?: ({
            address?: string | undefined;
            topics?: string[] | undefined;
            data?: Uint8Array | undefined;
            blockNumber?: number | undefined;
            txHash?: string | undefined;
            txIndex?: number | undefined;
            blockHash?: string | undefined;
            index?: number | undefined;
            removed?: boolean | undefined;
        }[] & ({
            address?: string | undefined;
            topics?: string[] | undefined;
            data?: Uint8Array | undefined;
            blockNumber?: number | undefined;
            txHash?: string | undefined;
            txIndex?: number | undefined;
            blockHash?: string | undefined;
            index?: number | undefined;
            removed?: boolean | undefined;
        } & {
            address?: string | undefined;
            topics?: (string[] & string[] & { [K_4 in Exclude<keyof I_1["logs"][number]["topics"], keyof string[]>]: never; }) | undefined;
            data?: Uint8Array | undefined;
            blockNumber?: number | undefined;
            txHash?: string | undefined;
            txIndex?: number | undefined;
            blockHash?: string | undefined;
            index?: number | undefined;
            removed?: boolean | undefined;
        } & { [K_5 in Exclude<keyof I_1["logs"][number], keyof Log>]: never; })[] & { [K_6 in Exclude<keyof I_1["logs"], keyof {
            address?: string | undefined;
            topics?: string[] | undefined;
            data?: Uint8Array | undefined;
            blockNumber?: number | undefined;
            txHash?: string | undefined;
            txIndex?: number | undefined;
            blockHash?: string | undefined;
            index?: number | undefined;
            removed?: boolean | undefined;
        }[]>]: never; }) | undefined;
        ret?: Uint8Array | undefined;
        vmError?: string | undefined;
        gasUsed?: number | undefined;
    } & { [K_7 in Exclude<keyof I_1, keyof MsgEthereumTxResponse>]: never; }>(object: I_1): MsgEthereumTxResponse;
};
/** Msg defines the evm Msg service. */
export interface Msg {
    /** EthereumTx defines a method submitting Ethereum transactions. */
    EthereumTx(request: MsgEthereumTx): Promise<MsgEthereumTxResponse>;
}
export declare class MsgClientImpl implements Msg {
    private readonly rpc;
    private readonly service;
    constructor(rpc: Rpc, opts?: {
        service?: string;
    });
    EthereumTx(request: MsgEthereumTx): Promise<MsgEthereumTxResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export {};
