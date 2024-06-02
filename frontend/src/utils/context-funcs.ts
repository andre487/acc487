import React, {useContext} from 'react';
import {AppDataContext} from '../types/state.ts';

export const AppContext = React.createContext<AppDataContext | null>(null);

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('Use app context within provider!');
    }
    return context;
}
