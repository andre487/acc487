import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './main.css';

const rootNode = document.getElementById('root');

if (rootNode) {
    ReactDOM.createRoot(rootNode).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
} else {
    console.log('There is no a root node for React');
}
