export declare enum ValidatorsNetworkStatus {
    Unbonded = "BOND_STATUS_UNBONDED",
    Unbonding = "BOND_STATUS_UNBONDING",
    Bonded = "BOND_STATUS_BONDED",
    All = "BOND_STATUS_UNSPECIFIED"
}
export declare enum ValidatorStatus {
    Unbonded = 0,
    Unbonding = 1,
    Bonded = 2,
    All = 3
}
export declare const ValidatorsStatusMap: Map<number, string>;
export declare const ParsedValidatorsStatusMap: Map<ValidatorStatus, ValidatorStatus>;
export interface Validator {
    address?: string;
    publicKey?: string;
    name?: string;
    votingPower?: string;
    totalTokens?: string;
    comission?: string;
    status?: ValidatorStatus;
}
export interface ParsedLightValidatorItem {
    address: string;
    name: string;
    status: ValidatorStatus;
}
export interface ParsedValidatorItem extends ParsedLightValidatorItem {
    votingPower: string;
    totalTokens: string;
    comission: string;
}
export interface ParsedValidatorsData {
    data: ParsedValidatorItem[] | ParsedLightValidatorItem[];
    page: number;
}
