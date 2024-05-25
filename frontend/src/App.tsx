import { useState, useEffect } from 'react';
import Header from './components/header/Header.tsx';
import { API_BASE_URL } from './settings.ts';
import { AppData } from './types.ts';
import Code from './components/code/Code.tsx';
import './App.css';

function App() {
    const [data, setData] = useState({} as AppData);

    useEffect(() => {
        const url = `${API_BASE_URL}/test-data`;
        fetch(url, {credentials: 'include'})
            .then(resp => {
                return resp.json();
            })
            .then(data_ => {
                const newData = {...data, appData: data_};
                setData(newData);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    return (
        <>
            <Header />
            <Code data={data} />
        </>
    );
}

export default App;
