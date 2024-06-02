import React, {useState} from 'react';
import {AppData} from '../types/state.ts';
import {ROGlobalConfig} from '../types/globals.ts';
import {AccountStatePureData} from '../types/acc.ts';
import {AppContext} from './context-funcs.ts';

export function AppContextProvider({children, value}: React.ProviderProps<ROGlobalConfig>) {
    const [appData, setAppData] = useState<AppData>({});
    const [accPureData, setAccPureData] = useState<AccountStatePureData>({accounts: []});
    const [errors, setErrors] = useState<Error[]>([]);
    return (
        <AppContext.Provider value={{
            appData,
            setAppData,
            accPureData,
            setAccPureData,
            errors,
            setErrors,
            config: value,
        }}>
            {children}
        </AppContext.Provider>
    );
}
