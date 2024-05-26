import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {AppContextProvider} from './utils/context.tsx';
import {WindowWithConfig, ROGlobalConfig} from './types.ts';
import './main.scss';

const rootNode = document.getElementById('root');
if (rootNode) {
    ReactDOM.createRoot(rootNode).render(
        <React.StrictMode>
            <AppContextProvider value={getConfig()}>
                <App />
            </AppContextProvider>
        </React.StrictMode>,
    );
} else {
    console.log('There is no a root node for React');
}

function getConfig(): ROGlobalConfig {
    const win: WindowWithConfig = window;
    if (!win.config) {
        throw new Error('Config is not defined');
    }
    if (!win.config.apiBaseUrl) {
        throw new Error('apiBaseUrl is not defined');
    }
    if (!win.config.user) {
        throw new Error('user is not defined');
    }
    return win.config as ROGlobalConfig;
}
