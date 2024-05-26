import {ReactGrid, CellChange, DefaultCellTypes} from '@silevis/reactgrid';
import '@silevis/reactgrid/styles.scss';
import './Grid.scss';
import {AccountStateData} from '../../models/acc.ts';
import {AppData, AppDataSetter} from '../../types/state.ts';

export interface GridProps {
    accId: number;
    appData: AppData;
    setAppData: AppDataSetter;
}

export default function Grid(props: GridProps) {
    const {accId, appData, setAppData} = props;
    const accData = appData.accData ?? new AccountStateData();

    const handleChanges = (changes: CellChange<DefaultCellTypes>[]) => {
        setAppData({
            ...accData,
            accData: accData.applyChanges(accId, changes),
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
