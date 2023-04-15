
// React
import React, { useContext, createContext, useState } from 'react';

// Material UI
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


// Example log file
const logText = `Device01 2023 04 15 10 15 30 EDT S 42 38 56 N 71 19 48 W
Device02 2023 04 15 11 00 05 EDT V 42 39 12 N 71 19 30 W
Device01 2023 04 15 14 35 20 EDT S 42 39 02 N 71 20 02 W
Device03 2023 04 15 16 45 10 EDT V 42 38 45 N 71 19 10 W
Device02 2023 04 15 20 00 00 EDT S 42 38 38 N 71 20 22 W`;

// Log data structure
export const Log = {
    deviceId: 0,
    dateTime: {
        year: 2023,
        month: 4,
        day: 15,
        hour: 12,
        minute: 30,
        second: 45,
        timezone: 'UTC',
    },
    detectionType: '', // 'S' for seismic, 'V' for voice, 'B' low battery
    latitude: {
        degrees: 37,
        minutes: 47,
        seconds: 15,
        cardinalPoint: 'N',
    },
    longitude: {
        degrees: 122,
        minutes: 25,
        seconds: 20,
        cardinalPoint: 'W',
    },
};

// Device data structure
export const Device = {
    id: 0,
    name: 'Device01',
    BleDevice: null,
    connection: null,
    isConnected: false,
    deviceType: '', // 'real' or 'simulated'
    logFile: logText,
    logData: [],
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
            deviceList, setDeviceList,
        }}>
            {children}
        </DataStoreContext.Provider>
    );
};


// Function to parse a log file
export function parseLogData(text) {
    const lines = text.split('\n');
    const logObjects = lines.map(line => {
        const [
            deviceId,
            year, month, day,
            hour, minute, second,
            timezone,
            detectionType,
            latDeg, latMin, latSec, latCP,
            lonDeg, lonMin, lonSec, lonCP
        ] = line.split(' ');

        return {
            deviceId: deviceId,
            dateTime: {
                year: parseInt(year),
                month: parseInt(month),
                day: parseInt(day),
                hour: parseInt(hour),
                minute: parseInt(minute),
                second: parseInt(second),
                timezone: timezone,
            },
            detectionType: detectionType,
            latitude: {
                degrees: parseInt(latDeg),
                minutes: parseInt(latMin),
                seconds: parseInt(latSec),
                cardinalPoint: latCP,
            },
            longitude: {
                degrees: parseInt(lonDeg),
                minutes: parseInt(lonMin),
                seconds: parseInt(lonSec),
                cardinalPoint: lonCP,
            },
        };
    });

    return logObjects;
}