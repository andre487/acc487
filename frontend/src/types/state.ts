import {O} from 'ts-toolbelt';
import {GlobalConfig} from './globals.ts';
import {AccountStatePureData} from './acc.ts';

export interface AppData {
    version?: number;
    appData?: object;
    notifications?: string[];
}

export type AppDataSetter = (data: AppData) => void;
export type AccPureDataSetter = (data: AccountStatePureData) => void;
export type ErrorsSetter = (error: Error[]) => void;

export interface AppDataContext {
    config: O.Readonly<GlobalConfig, keyof GlobalConfig, 'deep'>;
    appData: AppData;
    setAppData: AppDataSetter;
    accPureData: AccountStatePureData;
    setAccPureData: AccPureDataSetter;
    errors: Error[];
    setErrors: ErrorsSetter;
}
