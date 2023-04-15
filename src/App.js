
// React
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from "react-router-dom";
import grey from '@mui/material/colors/grey';

// Material UI
import { createTheme, ThemeProvider } from "@mui/material";
import Box from '@mui/material/Box';

// Local Components
import Layout from './components/Layout/Layout';
import DashboardPage from './pages/DashboardPage';
import NotificationPage from './pages/NotificationPage';
import SettingsPage from './pages/SettingsPage';
import DevicesPage from './pages/DevicesPage';
import DeviceDetailsPage from './pages/DeviceDetailsPage';

// Local
import { DataStoreContext } from './dataStore';


// Create light theme
const lightTheme = createTheme({ 
    palette: { 
        mode: "light",
        background: {
            default: grey[200], // or grey[200] for a slightly darker shade
        },
    },
});

// Create dark theme
const darkTheme = createTheme({ 
    palette: { mode: "dark", },
});

// App Component
export default function App() {

    // Get dark mode from data store
    const { darkMode, setDarkMode } = React.useContext(DataStoreContext);

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme }>
            <HashRouter basename="/">
                <Routes>
                    <Route path='/' element={<Layout />} >
                        <Route index element={<DashboardPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/notification" element={<NotificationPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/devices" element={<DevicesPage />} />
                        <Route path="/devices/:id" element={<DeviceDetailsPage />} />
                    </Route>
                </Routes>
            </HashRouter>
        </ThemeProvider>
        
    );
}