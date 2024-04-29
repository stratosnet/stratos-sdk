import * as Types from './validatorsTypes';
export declare const getValidatorsBondedToDelegator: (delegatorAddress: string) => Promise<Types.ParsedValidatorsData>;
export declare const getValidators: (status?: Types.ValidatorStatus, page?: number) => Promise<Types.ParsedValidatorsData>;
