
// React
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DataStoreProvider } from './dataStore';

// Add Leaflet CSS
import './App.css';
import 'leaflet/dist/leaflet.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <DataStoreProvider>
            <App />
        </DataStoreProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
