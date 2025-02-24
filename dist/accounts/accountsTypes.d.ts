export interface OtherBalanceCardMetrics {
    ozone?: string;
    detailedBalance?: {
        [key: string]: string | number;
    };
}
export interface BalanceCardMetrics {
    available: string;
    delegated: string;
    unbounding: string;
    reward: string;
    detailedBalance?: any;
}
