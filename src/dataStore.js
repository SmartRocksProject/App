
// React
import React, { useContext, createContext, useState } from 'react';

// Material UI
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


// Create data store context
const DataStoreContext = createContext();

// Create data store provider
const DataStoreProvider = ({ children }) => {

    // State to store dark/light mode
    const [darkMode, setDarkMode] = useState(false);

    // State to store open/close drawer layout
    const theme = useTheme();
    const isMD = useMediaQuery(theme.breakpoints.up('md'));
    const [openDrawer, setOpenDrawer] = useState(isMD ? true : false);

    // State to store ble devices
    const [bleDevices, setBleDevices] = useState([]);

    // State to store active connection
    const [activeConnection, setActiveConnection] = useState(null);

    return (
        <DataStoreContext.Provider value={{
            darkMode, setDarkMode,
            openDrawer, setOpenDrawer,
            bleDevices, setBleDevices,
            activeConnection, setActiveConnection,
        }}>
            {children}
        </DataStoreContext.Provider>
    );
};

// Create data store hook
const useDataStoreContext = () => {
    const context = useContext(DataStoreContext);

    if (!context) {
        throw new Error('useDataStoreContext must be used within a DataStoreProvider');
    }

    const { bleDevices, setBleDevices, activeConnection, setActiveConnection } = context;

    return {
        bleDevices,
        setBleDevices,
        activeConnection,
        setActiveConnection,
    };
};



// Exports
export {
    DataStoreContext,
    DataStoreProvider,
    useDataStoreContext,
};
