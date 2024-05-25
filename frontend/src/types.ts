import { O } from 'ts-toolbelt';

export interface GlobalConfig {
    apiBaseUrl: string;
    user: string;
}

export type RawGlobalConfig = O.Optional<GlobalConfig>;

export interface WindowWithConfig extends Window {
    config?: RawGlobalConfig;
}

export interface AppData {
    appData?: object;
    errors?: Error[];
    notifications?: string[];
}
