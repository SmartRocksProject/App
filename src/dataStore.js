
// React
import React, { useContext, createContext, useState } from 'react';

// Material UI
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


// Log data structure
const Log = {
    id: 0,
    device: null,
    GPS: {
        lat: 0,
        lon: 0,
        alt: 0,
    },
    unixTimeStamp: 0,
    DetectionType: '',
};

// Device data structure
const Device = {
    id: 0,
    name: '',
    BleDevice: null,
    isConnected: false,
    isDemo: false,
};


// Create data store context
export const DataStoreContext = createContext();

// Create data store provider
export const DataStoreProvider = ({ children }) => {

    // State to store dark/light mode
    const [darkMode, setDarkMode] = useState(false);

    // State to store open/close drawer layout
    const theme = useTheme();
    const isMD = useMediaQuery(theme.breakpoints.up('md'));
    const [openDrawer, setOpenDrawer] = useState(isMD ? true : false);
    const [openDeviceDialog, setOpenDeviceDialog] = useState(false);

    // State to store ble devices
    const [deviceList, setDeviceList] = useState([]);
    const [bleDevices, setBleDevices] = useState([]);

    // State to store active connection
    const [activeConnection, setActiveConnection] = useState(null);

    return (
        <DataStoreContext.Provider value={{
            darkMode, setDarkMode,
            openDrawer, setOpenDrawer,
            bleDevices, setBleDevices,
            activeConnection, setActiveConnection,
            openDeviceDialog, setOpenDeviceDialog,
        }}>
            {children}
        </DataStoreContext.Provider>
    );
};

