
// React 
import React from 'react';
import { Constants, IBLEConnection } from '@smartrocksproject/meshtasticjs';


// Helper function to generate a random ID
export const randId = () => {return Math.floor(Math.random() * 1e9);};

// Connect to a BLE device
export const onConnect = async (BLEDevice, setActiveConnection) => {
    const id = randId();
    const connection = new IBLEConnection(id);
    try {
        await connection.connect({
            device: BLEDevice,
        });
        console.log('Connected to', BLEDevice.name);
        setActiveConnection(connection);
    } catch (error) {
        console.error('Failed to connect:', error);
    }
};

// Use XModem to download a file
export const handleXModemOperation = async (activeConnection) => {
    if (activeConnection) {
        const xmodem = activeConnection.XModem;
        try {
            const filename = '/Masterfile.txt'; // Replace with the desired filename
            const result = await xmodem.downloadFile(filename);
            console.log(`XModem downloadFile result: ${result}`);
        } catch (error) {
            console.error('Error using XModem downloadFile:', error);
        }
    } else {
        console.error('No active connection');
    }
};

// Request a new BLE device
export const requestNewDevice = async (setDevices) => {
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [Constants.serviceUUID] }],
        });

        setDevices((prevDevices) => [...prevDevices, device]);
    } catch (error) {
        console.error('Error requesting new device:', error);
    }
};

