import {Column, Row, CellChange, DefaultCellTypes, TextCell, NumberCell} from '@silevis/reactgrid';
import {validateAccountStatePureData} from '../schemas/acc/validators';
import {AccountStatePureData, AccountData} from '../typings/acc';

const headerRow: Row = {
    rowId: 'header',
    cells: [
        {type: 'header', text: 'Name'},
        {type: 'header', text: 'Value'},
        {type: 'header', text: 'Currency'},
    ],
};

export class AccountStateData implements AccountStatePureData {
    public static fromJson(data: unknown): AccountStateData {
        if (!validateAccountStatePureData(data)) {
            throw new Error('Invalid account state data');
        }
        return new AccountStateData(data.accounts);
    }

    constructor(public accounts: AccountData[] = [], public version = 0) {
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
