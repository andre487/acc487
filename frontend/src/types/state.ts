import {O} from 'ts-toolbelt';
import {GlobalConfig} from './globals.ts';
import {IAccountStateData} from './acc.ts';

export interface AppData {
    version?: number;
    appData?: object;
    accData?: IAccountStateData;
    errors?: Error[];
    notifications?: string[];
}

export type AppDataSetter = (data: AppData) => void;

export interface AppDataContext {
    config: O.Readonly<GlobalConfig, keyof GlobalConfig, 'deep'>;
    appData: AppData;
    setAppData: AppDataSetter;
}
