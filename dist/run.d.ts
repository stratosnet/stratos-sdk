import { HdPath } from '@cosmjs/crypto';
/**
 * const keyPath =                            "m/44'/606'/0'/0/1";
 * The Cosmos Hub derivation path in the form `m/44'/118'/0'/0/a`
 * with 0-based account index `a`.
 */
export declare function makeStratosHubPath(a: number): HdPath;
