export enum ValidatorsNetworkStatus {
  Unbonded = 'BOND_STATUS_UNBONDED',
  Unbonding = 'BOND_STATUS_UNBONDING',
  Bonded = 'BOND_STATUS_BONDED',
  All = 'BOND_STATUS_UNSPECIFIED',
}

export enum ValidatorStatus {
  Unbonded,
  Unbonding,
  Bonded,
  All,
}

export const ValidatorsStatusMap = new Map<number, string>([
  [ValidatorStatus.Bonded, ValidatorsNetworkStatus.Bonded],
  [ValidatorStatus.Unbonded, ValidatorsNetworkStatus.Unbonded],
  [ValidatorStatus.Unbonding, ValidatorsNetworkStatus.Unbonding],
]);

export const ParsedValidatorsStatusMap = new Map<ValidatorStatus, ValidatorStatus>([
  [ValidatorStatus.Bonded, ValidatorStatus.Bonded],
  [ValidatorStatus.Unbonded, ValidatorStatus.Unbonded],
  [ValidatorStatus.Unbonding, ValidatorStatus.Unbonding],
]);

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
