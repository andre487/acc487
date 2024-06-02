import React, {useState} from 'react';
import {ROGlobalConfig} from '../types/globals.ts';
import {AccountStatePureData} from '../types/acc.ts';
import {AppContext} from './context-funcs.ts';

export function AppContextProvider({children, value}: React.ProviderProps<ROGlobalConfig>) {
    const [accPureData, setAccPureData] = useState<AccountStatePureData>({accounts: []});
    const [errors, setErrors] = useState<Error[]>([]);
    const [notifications, setNotifications] = useState<string[]>([]);
    return (
        <AppContext.Provider value={{
            accPureData,
            setAccPureData,
            errors,
            setErrors,
            notifications,
            setNotifications,
            config: value,
        }}>
            {children}
        </AppContext.Provider>
    );
}
