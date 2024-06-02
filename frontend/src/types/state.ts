import {O} from 'ts-toolbelt';
import {GlobalConfig} from './globals.ts';
import {AccountStatePureData} from './acc.ts';

export type AccPureDataSetter = (data: AccountStatePureData) => void;
export type ErrorsSetter = (error: Error[]) => void;
export type NotificationsSetter = (notifications: string[]) => void;

export interface AppDataContext {
    config: O.Readonly<GlobalConfig, keyof GlobalConfig, 'deep'>;
    accPureData: AccountStatePureData;
    setAccPureData: AccPureDataSetter;
    errors: Error[];
    setErrors: ErrorsSetter;
    notifications: string[];
    setNotifications: NotificationsSetter;
}
