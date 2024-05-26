import React, {useState, useContext} from 'react';
import {AppData, AppDataContext, ROGlobalConfig} from '../types.ts';

export const AppContext = React.createContext<AppDataContext | null>(null);

export function AppContextProvider({children, value}: React.ProviderProps<ROGlobalConfig>) {
    const [appData, setAppData] = useState<AppData>({});
    return (
        <AppContext.Provider value={{appData, setAppData, config: value}}>
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
