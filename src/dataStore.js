
// React
import React, { useContext, createContext, useState } from 'react';
import { Protobuf } from "@smartrocksproject/meshtasticjs";

// Material UI
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


// Example log file
const logText = `1 2023 04 20 14 30 00 UTC S 42 38 52 N 71 19 20 W
2 2023 04 20 14 35 00 UTC V 42 39 08 N 71 19 33 W
3 2023 04 20 14 40 00 UTC S 42 39 21 N 71 19 45 W
4 2023 04 20 14 45 00 UTC V 42 38 45 N 71 19 55 W
5 2023 04 20 14 50 00 UTC S 42 38 31 N 71 19 10 W
`

// LogEvent data structure
export const LogEvent = {
    nodeId: 0,
    year: 2020,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    timezone: 'UTC',
    detectionType: 'N/A', // 'S' or 'V' for 'Seismic' or 'Voice'
    latDeg: 0,
    latMin: 0,
    latSec: 0,
    latCP: 'N',
    lonDeg: 0,
    lonMin: 0,
    lonSec: 0,
    lonCP: 'E'
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

    // Implement logic for setting the channel settings
    channels: new Map(),
    addChannel(channel) {
        if (Device) {
            Device.channels.set(channel.index, channel);
        }
    },

    // Implement logic for setting the config
    config: Protobuf.Config,
    setConfig: (new_config) => {
        if (Device.config && new_config.payloadVariant) {
            switch (new_config.payloadVariant.case) {
                case "device":
                    Device.config.device = new_config.payloadVariant.value;
                    break;
                case "position":
                    Device.config.position = new_config.payloadVariant.value;
                    break;
                case "power":
                    Device.config.power = new_config.payloadVariant.value;
                    break;
                case "network":
                    Device.config.network = new_config.payloadVariant.value;
                    break;
                case "display":
                    Device.config.display = new_config.payloadVariant.value;
                    break;
                case "lora":
                    Device.config.lora = new_config.payloadVariant.value;
                    break;
                case "bluetooth":
                    Device.config.bluetooth = new_config.payloadVariant.value;
                    break;
            }
        }
    },
      
    // Implement logic for setting the module config
    moduleConfig: Protobuf.ModuleConfig,
    setModuleConfig(config) {
        if (Device) {
            switch (config.payloadVariant.case) {
                case "mqtt":
                    Device.moduleConfig.mqtt = config.payloadVariant.value;
                    break;
                case "serial":
                    Device.moduleConfig.serial = config.payloadVariant.value;
                    break;
                case "externalNotification":
                    Device.moduleConfig.externalNotification = config.payloadVariant.value;
                    break;
                case "storeForward":
                    Device.moduleConfig.storeForward = config.payloadVariant.value;
                    break;
                case "rangeTest":
                    Device.moduleConfig.rangeTest = config.payloadVariant.value;
                    break;
                case "telemetry":
                    Device.moduleConfig.telemetry = config.payloadVariant.value;
                    break;
                case "cannedMessage":
                    Device.moduleConfig.cannedMessage = config.payloadVariant.value;
                    break;
                case "audio":
                    Device.moduleConfig.audio = config.payloadVariant.value;
            }
        }
    },

    // Implement logic for setting the hardware
    hardware: Protobuf.NodeInfo,
    setHardware: (nodeInfo) => {
        if (Device) {
            Device.hardware = nodeInfo;
        }
    },

    // Node num
    nodeNum: 0,
    setNodeNum: (nodeNum) => {
        if (Device) {
            Device.nodeNum = nodeNum;
        }
    }
    
};

// Create allSubscriber
export function subscribeAll(device, connection) {
    let myNodeNum = 0;

    // Subscribe to channel packets
    connection.events.onChannelPacket.subscribe((channel) => {
        device.addChannel(channel);
    });

    // Subscribe config packets
    connection.events.onConfigPacket.subscribe(function (config) {
        device.setConfig(config);
        // console.log("Config set!", config);
    });

    // Subscribe module config packets
    connection.events.onModuleConfigPacket.subscribe(function (moduleConfig) {
        device.setModuleConfig(moduleConfig);
    });

    // Subscribe to node info packets
    connection.events.onMyNodeInfo.subscribe((nodeInfo) => {
        device.setHardware(nodeInfo);
        device.setNodeNum(nodeInfo.nodeNum);
    });
}

// Function to display the GPS coordinates of a log
export function displayGPS(log) {
    if (!log) return "Not available";
    const lat = `${log.latDeg}°${log.latMin}'${log.latSec}" ${log.latCP}`;
    const lon = `${log.lonDeg}°${log.lonMin}'${log.lonSec}" ${log.lonCP}`;
    return (`${lat}, ${lon}`);
}

// Function to display the log message type
export function displayMessageType(log) {
    if (!log) return (`No message type available`);
    if (log.detectionType === 'S') {
        return "Seismic Event Detected (S)";
    } else if (log.detectionType === 'V') {
        return "Vibration Event Detected (V)";
    } else {
        return "No Event Detected";
    }
}

// Get the time
export function getTime(log) {
    if (!log) return (`No time available`);
    const time = new Date();
    time.setUTCFullYear(log.year);
    time.setUTCMonth(log.month - 1);
    time.setUTCDate(log.day);
    time.setUTCHours(log.hour);
    time.setUTCMinutes(log.minute);
    time.setUTCSeconds(log.second);
    time.setUTCMilliseconds(0); // optional, depending on your requirements
    return time.toLocaleString();
}

// Helper function to create a LogEvent object
export function processLogLine(line) {

    // Remove Carriage Return characters and other non-alphanumeric characters   
    const sanitizedLine = line.replace(/[^0-9a-zA-Z ]/g, '');
    console.log("Parsing Sanitized Log line: ", sanitizedLine);

    // Split the line into parts
    const parts = sanitizedLine.split(' ');

    return {
        ...LogEvent,
        nodeId: parseInt(parts[0], 10),
        year: parseInt(parts[1], 10),
        month: parseInt(parts[2], 10),
        day: parseInt(parts[3], 10),
        hour: parseInt(parts[4], 10),
        minute: parseInt(parts[5], 10),
        second: parseInt(parts[6], 10),
        timezone: parts[7],
        detectionType: parts[8],
        latDeg: parseInt(parts[9], 10),
        latMin: parseInt(parts[10], 10),
        latSec: parseInt(parts[11], 10),
        latCP: parts[12],
        lonDeg: parseInt(parts[13], 10),
        lonMin: parseInt(parts[14], 10),
        lonSec: parseInt(parts[15], 10),
        lonCP: parts[16],
    };
}

// Helper function to parse log file and return an array of LogEvent objects
export function parseLogFile(logFileContent) {

    // Split the log file into an array of lines
    const lines = logFileContent.split('\n');

    // Filter out empty lines and lines with only whitespace characters
    const nonEmptyLines = lines.filter(line => line.trim() !== '');

    // Helper function to process a single line of the log file
    return nonEmptyLines.map(line => processLogLine(line));
}

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
  
// Helper function to check if a log object can be added to the logEvents array
export const canAddLogEvent = (logEvents, logEvent) => {

    // Check if any of the nodeId or detection time properties are NaN
    if (isNaN(logEvent.nodeId) ||
        isNaN(logEvent.year) ||
        isNaN(logEvent.month) ||
        isNaN(logEvent.day) ||
        isNaN(logEvent.hour) ||
        isNaN(logEvent.minute) ||
        isNaN(logEvent.second)) {
        return false;
    }

    // Check if the logEvent is already in the logEvents array by comparing nodeId and detection time properties
    const logEventExists = logEvents.some((logEventInArray) => {
        return logEventInArray.nodeId === logEvent.nodeId &&
            logEventInArray.year === logEvent.year &&
            logEventInArray.month === logEvent.month &&
            logEventInArray.day === logEvent.day &&
            logEventInArray.hour === logEvent.hour &&
            logEventInArray.minute === logEvent.minute &&
            logEventInArray.second === logEvent.second;
    });

    // If the logEvent is not already in the logEvents array, then it can be added
    return !logEventExists;
};

// Helper function to return the last log event for a given device number
export const getLastLogEvent = (logEvents, deviceNum) => {

    // Filter the logEvents array to only include log events for the given device number
    const filteredLogEvents = logEvents.filter((logEvent) => {
        return logEvent.nodeNum === deviceNum;
    });

    // Sort the filtered log events by unix timestamp
    filteredLogEvents.sort((a, b) => {
        return a.unixTimeStamp - b.unixTimeStamp;
    });

    // Return the last log event in the filtered log events array
    return filteredLogEvents[filteredLogEvents.length - 1];
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
    // const [deviceList, setDeviceList] = useState(() => {
    //     const storedDeviceList = localStorage.getItem('deviceList');
    //     return storedDeviceList ? JSON.parse(storedDeviceList) : [];
    // });
    const [logEvents, setLogEvents] = useState(() => {
        const storedLogEvents = localStorage.getItem('logEvents');
        return storedLogEvents ? JSON.parse(storedLogEvents) : [];
    });
    const [notifications, setNotifications] = useState(() => {
        const storedNotifications = localStorage.getItem('notifications');
        return storedNotifications ? JSON.parse(storedNotifications) : 0;
    });
    const [activeConnection, setActiveConnection] = useState(null);

    // Save states to local storage
    React.useEffect(() => {
        localStorage.setItem('deviceList', JSON.stringify(deviceList));
    }, [deviceList]);

    React.useEffect(() => {
        localStorage.setItem('logEvents', JSON.stringify(logEvents));
    }, [logEvents]);

    React.useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

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