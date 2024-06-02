import {O} from 'ts-toolbelt';

export interface GlobalConfig {
    apiBaseUrl: string;
    user: string;
}

export type RawGlobalConfig = O.Optional<GlobalConfig>;
export type ROGlobalConfig = O.Readonly<GlobalConfig, keyof GlobalConfig, 'deep'>;

export interface WindowWithConfig extends Window {
    config?: RawGlobalConfig;
}
