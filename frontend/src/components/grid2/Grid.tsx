import {AccPureDataSetter} from '@context/appContext.ts';
import {HotTable, HotTableClass} from '@handsontable/react';
import {AccountStateData} from '@models/acc.ts';
import {AccountStatePureData} from '@typings/acc.ts';
import Handsontable from 'handsontable';
import {registerAllModules} from 'handsontable/registry';
import {useRef} from 'react';
import {hyperFormulaInstance} from './formulas.ts';
import './Grid.scss';

registerAllModules();

export interface GridProps {
    accId: number;
    accPureData: AccountStatePureData;
    setAccPureData: AccPureDataSetter;
}

export default function Grid2({accId, accPureData, setAccPureData}: GridProps) {
    const accData = new AccountStateData(accPureData.accounts);
    const hotRef = useRef<HotTableClass>(null);

    function onAfterChange(change: Handsontable.CellChange[] | null, source: Handsontable.ChangeSource) {
        if (!change || source !== 'edit') {
            return;
        }
        const data = hotRef.current?.hotInstance?.getData();
        const changed = accData.applyHotTableChanges(accId, data);
        setAccPureData({
            ...accData,
            accounts: changed.accounts,
            version: changed.version,
        });
    }

    return (
        <HotTable
            ref={hotRef}
            data={accData.getHotTableData(accId)}
            columns={accData.getHotTableColumnSettings()}
            cell={accData.getHotTableCellSettings()}
            rowHeaders={true}
            colHeaders={true}
            height="auto"
            width="auto"
            minSpareRows={1}
            autoWrapRow={true}
            autoWrapCol={true}
            licenseKey="non-commercial-and-evaluation"
            formulas={{
                engine: hyperFormulaInstance,
                sheetName: 'Sheet1',
            }}
            afterChange={onAfterChange}
        />
    );
}
