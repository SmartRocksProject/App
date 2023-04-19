
// React
import React, { useContext, createContext, useState } from 'react';

// Material UI
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


// Example log file
const logText = `
1 2023 04 20 14 30 00 UTC S 42 38 52 N 71 19 20 W
2 2023 04 20 14 35 00 UTC V 42 39 08 N 71 19 33 W
1 2023 04 20 14 40 00 UTC S 42 39 21 N 71 19 45 W
3 2023 04 20 14 45 00 UTC V 42 38 45 N 71 19 55 W
2 2023 04 20 14 50 00 UTC S 42 38 31 N 71 19 10 W
`

// LogEvent data structure
export const LogEvent = {
    nodeNum: 0,
    gpsData: {
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
        altitude: 0,
    },
    unixTimeStamp: 0,
    detectionType: '', // 'S' for seismic, 'V' for voice
    dateTime: {
        year: 2023,
        month: 4,
        day: 15,
        hour: 12,
        minute: 30,
        second: 45,
        timezone: 'UTC',
    },
};

// Device data structure
export const Device = {

    // Unique ID for the device
    id: 0, 

    // Device name
    name: 'Device 01',

    // Chrome API BleDevice device object
    BleDevice: null, 
    connection: null,

    // Is this a simulated or real device?
    isReal: false,

    // If this is a real device, is it connected?
    isConnected: false,

    // Current master log file from the node device
    logFile: logText,

    // Array of LogEvent objects parsed from the log file
    logData: [],
};

// Helper function to parse log file and return an array of LogEvent objects
export const parseLogFile = (logFile) => {

    // Array to store parsed log data
    const logData = [];

    // Split log file into lines
    const logLines = logFile.split('\n');

    // Parse each line
    for (let i = 0; i < logLines.length; i++) {

        // Get the current line
        const logLine = logLines[i];

        // Split the line into an array of strings
        const logLineSplit = logLine.split(' ');

        // If the line has 9 elements, it is a valid log event
        if (logLineSplit.length === 9) {

            // Create a new LogEvent object
            const logEvent = {
                nodeNum: parseInt(logLineSplit[0]),
                gpsData: {
                    latitude: {
                        degrees: parseInt(logLineSplit[3]),
                        minutes: parseInt(logLineSplit[4]),
                        seconds: parseInt(logLineSplit[5]),
                        cardinalPoint: logLineSplit[6],
                    },
                    longitude: {
                        degrees: parseInt(logLineSplit[7]),
                        minutes: parseInt(logLineSplit[8]),
                        seconds: parseInt(logLineSplit[9]),
                        cardinalPoint: logLineSplit[10],
                    },
                    altitude: 0,
                },
                unixTimeStamp: 0,
                detectionType: logLineSplit[2], // 'S' for seismic, 'V' for voice
                dateTime: {
                    year: parseInt(logLineSplit[1]),
                    month: parseInt(logLineSplit[2]),
                    day: parseInt(logLineSplit[3]),
                    hour: parseInt(logLineSplit[4]),
                    minute: parseInt(logLineSplit[5]),
                    second: parseInt(logLineSplit[6]),
                    timezone: logLineSplit[7],
                },
            };

            // Add the new LogEvent object to the array
            logData.push(logEvent);
        }
    }

    // Return the array of LogEvent objects
    return logData;
};

// Helper function that given a deviceList array, sets each device connection status to false
export const disconnectAllDevices = (deviceList) => {

    // Loop through each device in the deviceList array
    for (let i = 0; i < deviceList.length; i++) {
        
        // Get the current device
        const device = deviceList[i];

        // Set the device connection status to false
        device.isConnected = false;
    }

    // Return the updated deviceList array
    return deviceList;
};

// Helper function to add a LogEvent object to the logEvents array if it is not already in the array
export const addLogEvent = (logEvents, logEvent) => {

    // Check if the logEvent is already in the logEvents array by checking the device number and unix timestamp
    const logEventExists = logEvents.some((logEventInArray) => {
        return logEventInArray.nodeNum === logEvent.nodeNum && logEventInArray.unixTimeStamp === logEvent.unixTimeStamp;
    });

    // If the logEvent is not already in the logEvents array, add it
    if (!logEventExists) {
        logEvents.push(logEvent);
        console.log('addLogEvent: Added LogEvent to logEvents array', logEvent);
    } else {
        console.log('addLogEvent: Log event already exists', logEvent);
    }

    // Return the updated logEvents array
    return logEvents;
};


// Create data store context
export const DataStoreContext = createContext();

// Create data store provider
export const DataStoreProvider = ({ children }) => {

    // GUI States
    const theme = useTheme();
    const isMD = useMediaQuery(theme.breakpoints.up('md'));
    const [openDrawer, setOpenDrawer] = useState(isMD ? true : false);
    const [openDeviceDialog, setOpenDeviceDialog] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Functional States
    const [deviceList, setDeviceList] = useState([]);
    const [logEvents, setLogEvents] = useState([]);
    const [notifications, setNotifications] = useState(Number);
    const [activeConnection, setActiveConnection] = useState(null);

    return (
        <DataStoreContext.Provider value={{
            darkMode, setDarkMode,
            openDrawer, setOpenDrawer,
            activeConnection, setActiveConnection,
            openDeviceDialog, setOpenDeviceDialog,
            deviceList, setDeviceList,
            logEvents, setLogEvents,
            notifications, setNotifications,
        }}>
            {children}
        </DataStoreContext.Provider>
    );
};
