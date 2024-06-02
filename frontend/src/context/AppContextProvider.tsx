import React, {useState} from 'react';
import {ROGlobalConfig} from '../typings/globals.ts';
import {AccountStatePureData} from '../typings/acc.ts';
import {AppContext} from './appContext.ts';

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
