import * as Types from './types';
export declare const getValidatorsBondedToDelegator: (delegatorAddress: string) => Promise<Types.ParsedValidatorsData>;
export declare const getValidators: (status?: Types.ValidatorStatus, page?: number | undefined) => Promise<Types.ParsedValidatorsData>;
