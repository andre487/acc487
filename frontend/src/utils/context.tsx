import React, {useState, useContext} from 'react';
import {AppDataContext, AppData} from '../types/state.ts';
import {ROGlobalConfig} from '../types/globals.ts';
import {AccountStatePureData} from '../types/acc.ts';

export const AppContext = React.createContext<AppDataContext | null>(null);

export function AppContextProvider({children, value}: React.ProviderProps<ROGlobalConfig>) {
    const [appData, setAppData] = useState<AppData>({});
    const [accPureData, setAccPureData] = useState<AccountStatePureData>({accounts: []});
    return (
        <AppContext.Provider value={{
            appData,
            setAppData,
            accPureData,
            setAccPureData,
            config: value,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('Use app context within provider!');
    }
    return context;
}
