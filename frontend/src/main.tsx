import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {AppContextProvider} from './context/AppContextProvider.tsx';
import {ROGlobalConfig, WindowWithConfig} from './typings/globals.ts';

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
