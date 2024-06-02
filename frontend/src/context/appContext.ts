import React, {useContext, Dispatch, SetStateAction} from 'react';
import {O} from 'ts-toolbelt';
import {GlobalConfig} from '../types/globals.ts';
import {AccountStatePureData} from '../types/acc.ts';

export type AccPureDataSetter = Dispatch<SetStateAction<AccountStatePureData>>;
export type ErrorsSetter = Dispatch<SetStateAction<Error[]>>;
export type NotificationsSetter = Dispatch<SetStateAction<string[]>>;

export interface AppDataContext {
    config: O.Readonly<GlobalConfig, keyof GlobalConfig, 'deep'>;
    accPureData: AccountStatePureData;
    setAccPureData: AccPureDataSetter;
    errors: Error[];
    setErrors: ErrorsSetter;
    notifications: string[];
    setNotifications: NotificationsSetter;
}

export const AppContext = React.createContext<AppDataContext | null>(null);

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('Use app context within provider!');
    }
    return context;
}
