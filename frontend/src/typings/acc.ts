export interface MoneyValue {
    amount: number;
    currency: string;
}

export interface AccountRecord {
    id: number;
    name: string;
    value: MoneyValue;
}

export interface AccountData {
    id: number;
    name: string;
    records: AccountRecord[];
}

export interface AccountStatePureData {
    version?: number;
    accounts: AccountData[];
}
