import {ReactGrid, CellChange, DefaultCellTypes} from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.scss';
import './Grid.scss';
import {AccountStateData} from '@models/acc.ts';
import {AccountStatePureData} from '@typings/acc.ts';
import {AccPureDataSetter} from '@context/appContext.ts';

export interface GridProps {
    accId: number;
    accPureData: AccountStatePureData;
    setAccPureData: AccPureDataSetter;
}

export default function Grid({accId, accPureData, setAccPureData}: GridProps) {
    const accData = new AccountStateData(accPureData.accounts);

    const handleChanges = (changes: CellChange<DefaultCellTypes>[]) => {
        const changed = accData.applyChanges(accId, changes);
        setAccPureData({
            ...accData,
            accounts: changed.accounts,
            version: changed.version,
        });
    };

    return (
        <div className="accGrid">
            <ReactGrid
                rows={accData.getRows(accId)}
                columns={accData.getColumns()}
                onCellsChanged={handleChanges}
                enableRangeSelection={true}
                enableColumnSelection={true} />
        </div>
    );
}
