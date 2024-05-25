import { useState, useEffect } from 'react';
import Header from './components/header/Header.tsx';
import { AppData, GlobalConfig, WindowWithConfig } from './types.ts';
import Code from './components/code/Code.tsx';
import { O } from 'ts-toolbelt';
import './App.css';

let _winConfig: GlobalConfig | null = null;

function App() {
    const config = getConfig();
    const [appData, setAppData] = useState({} as AppData);

    useEffect(() => {
        const url = `${config.apiBaseUrl}/test-data`;
        fetch(url, { credentials: 'include' })
            .then(resp => {
                return resp.json();
            })
            .then(data => {
                const newAppData = { ...appData, appData: data };
                setAppData(newAppData);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <>
            <Header user={config.user} />
            <Code data={appData} />
        </>
    );
}

export default App;

function getConfig(): O.Readonly<GlobalConfig> {
    if (_winConfig) {
        return _winConfig;
    }

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

    _winConfig = win.config as GlobalConfig;
    return _winConfig;
}
