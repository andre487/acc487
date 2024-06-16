import {CellChange, Column, DefaultCellTypes, NumberCell, Row, TextCell} from '@silevis/reactgrid';
import Handsontable from 'handsontable';
import thr from 'throw';
import {validateAccountStatePureData} from '../schemas/acc/validators';
import {AccountData, AccountStatePureData} from '../typings/acc';

const headerRowHotTable = ['Name', 'Value', 'Currency'];
const headerRow: Row = {
    rowId: 'header',
    cells: headerRowHotTable.map(text => ({type: 'header', text})),
};

// Fix export of CellSettings from handsontable/settings.d.ts that is not declared in package.json
export interface CellSettings extends Handsontable.CellMeta {
    row: number;
    col: number;
}

export class AccountStateData implements AccountStatePureData {
    public static fromJson(data: unknown): AccountStateData {
        if (!validateAccountStatePureData(data)) {
            throw new Error('Invalid account state data');
        }
        return new AccountStateData(data.accounts);
    }

    constructor(public accounts: AccountData[] = [], public version = 0) {
    }

    public getHotTableData(accId: number = 0) {
        const acc = this.accounts[accId];
        if (!acc) {
            return [];
        }

        return [
            headerRowHotTable,
            ...(acc.records?.map((val) => [val.name, val.value.amount, val.value.currency]) ?? []),
        ];
    }

    public getHotTableColumnSettings(): Handsontable.ColumnSettings[] {
        return [
            {type: 'text', allowRemoveColumn: false},
            {type: 'numeric', allowRemoveColumn: false},
            {type: 'autocomplete', source: ['RUB', 'USD', 'Other'], allowRemoveColumn: false},
        ];
    }

    public getHotTableCellSettings(): CellSettings[] {
        const res: CellSettings[] = [];
        for (let i = 0; i < headerRowHotTable.length; ++i) {
            res.push({row: 0, col: i, type: 'text', readOnly: true});
        }
        return res;
    }

    public getColumns(): Column[] {
        return [
            {
                columnId: 0,
                width: 200,
                resizable: true,
            },
            {
                columnId: 1,
                width: 100,
                resizable: true,
            },
            {
                columnId: 2,
                width: 100,
                resizable: true,
            },
        ];
    }

    public getRows(accId: number = 0) {
        const acc = this.accounts[accId];
        if (!acc) {
            return [];
        }

        return [
            headerRow,
            ...(acc.records?.map((val, idx) => {
                return {
                    rowId: idx,
                    cells: [
                        {type: 'text', text: val.name},
                        {type: 'number', value: val.value.amount},
                        {type: 'text', text: val.value.currency},
                    ],
                } as Row;
            }) ?? {}),
        ];
    }

    public applyHotTableChanges(accId: number, data: [string, number, string][] | undefined) {
        if (data == null) {
            return this;
        }
        const acc = this.accounts[accId] ?? thr(`There is no account ${accId}`);
        acc.records = [];
        for (const [id, [name, amount, currency]] of data.slice(1).entries()) {
            if (name == null && amount == null && currency == null) {
                continue;
            }
            acc.records[id] = {
                id,
                name: name ?? 'New record',
                value: {amount: amount ?? 0, currency: currency ?? 'RUB'},
            };
        }
        ++this.version;
        return this;
    }

    public applyChanges(accId: number, changes: CellChange<DefaultCellTypes>[]) {
        const acc = this.accounts[accId] ?? {
            id: 0,
            name: 'Empty account',
            records: [],
        };

        for (const change of changes) {
            const rowId = Number(change.rowId);
            switch (change.columnId) {
                case 0:
                    acc.records[rowId].name = (change.newCell as TextCell).text;
                    break;
                case 1:
                    acc.records[rowId].value.amount = (change.newCell as NumberCell).value;
                    break;
                case 2:
                    acc.records[rowId].value.currency = (change.newCell as TextCell).text;
                    break;
                default:
                    console.error('Grid: unknown columnId:', change.columnId);
            }
        }

        ++this.version;
        return this;
    }

    public toJSON(): string {
        return JSON.stringify({...this});
    }
}
