
// React 
import React from 'react';
import { Constants, IBLEConnection } from '@smartrocksproject/meshtasticjs';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// Local
import { DataStoreContext } from '../dataStore';


const randId = () => {
    return Math.floor(Math.random() * 1e9);
};

// Devices Page Component
export default function Devices() {

    const { bleDevices, setBleDevices } = React.useContext(DataStoreContext);
    const { activeConnection, setActiveConnection } = React.useContext(DataStoreContext);

    const onConnect = async (BLEDevice) => {
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

    const handleXModemOperation = async () => {
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

    const requestNewDevice = async () => {
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [Constants.serviceUUID] }],
            });

            setBleDevices((prevDevices) => [...prevDevices, device]);
        } catch (error) {
            console.error('Error requesting new device:', error);
        }
    };

    return (
        <div>
            <Typography variant="h6">Paired BLE Devices</Typography>
            <List>
                {bleDevices.map((device, index) => (
                    <ListItem key={index} button onClick={() => onConnect(device)}>
                        <ListItemText primary={device.name} />
                    </ListItem>
                ))}
            </List>
            {bleDevices.length === 0 && (
                <Typography variant="body1">No devices paired yet.</Typography>
            )}
            <Button variant="contained" color="primary" onClick={requestNewDevice}>
                Add New Device
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleXModemOperation}
                disabled={!activeConnection}
            >
                Use XModem
            </Button>
        </div>
    );

    return (
        <Box sx={{ }}>
            <h1>Devices</h1>
        </Box>
    );
}