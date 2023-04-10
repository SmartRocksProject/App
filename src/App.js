
// React
import React from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";

// Material UI
import { createTheme, ThemeProvider } from "@mui/material";
import Box from '@mui/material/Box';

// Local Components
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Notification from './pages/Notification';
import Settings from './pages/Settings';
import Devices from './pages/Devices';

// Local
import { DataStoreContext } from './dataStore';


// Create a light and dark themes
const lightTheme = createTheme({ palette: { mode: "light", },});
const darkTheme = createTheme({ palette: { mode: "dark", },});

// App Component
export default function App() {

    // Get dark mode from data store
    const { darkMode, setDarkMode } = React.useContext(DataStoreContext);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme }>
            <HashRouter basename="/">
                <Routes>
                    <Route path='/' element={<Layout />} >
                        <Route index element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/notification" element={<Notification />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/devices" element={<Devices />} />
                    </Route>
                </Routes>
            </HashRouter>
        </ThemeProvider>
        
    );
}