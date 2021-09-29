export declare enum ValidatorsNetworkStatus {
    Unbonded = "unbonded",
    Unbonding = "unbounding",
    Bonded = "bonded",
    All = "all"
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
