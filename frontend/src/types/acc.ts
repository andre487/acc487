import {Row, Column, CellChange, DefaultCellTypes} from '@silevis/reactgrid';

export interface IMoneyValue {
    amount: number;
    currency: string;
}

export interface IAccountRecord {
    id: number;
    name: string;
    value: IMoneyValue;
}

export interface IAccountData {
    id: number;
    name: string;
    records: IAccountRecord[];
}

export interface IAccountStateData {
    accounts: IAccountData[];

    getColumns: () => Column[];
    getRows: () => Row[];
    applyChanges: (accId: number, changes: CellChange<DefaultCellTypes>[]) => IAccountStateData;
}
