
// React 
import React from 'react';
import { Constants, IBLEConnection } from '@smartrocksproject/meshtasticjs';

// Material UI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// Local
import { DataStoreContext } from '../dataStore';
import DeviceCard from '../components/Card/DeviceCard';


// Generate a random ID
const randId = () => {
    return Math.floor(Math.random() * 1e9);
};

// Devices Page Component
export default function DevicesPage() {

    const { bleDevices, setBleDevices } = React.useContext(DataStoreContext);
    const { activeConnection, setActiveConnection } = React.useContext(DataStoreContext);

    console.log('bleDevices:', bleDevices);

    // Connect to a BLE device
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

    // Use XModem to download a file
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

    // Request a new BLE device
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
        <Box >
            <Typography variant="h5" sx={{p: 2}}>Paired BLE Devices</Typography>
            <Stack spacing={2} width="100%" >
                {bleDevices.map((device, index) => (
                    <>
                    <DeviceCard device={device} onConnect={onConnect} key={index}/>
                    <DeviceCard device={device} onConnect={onConnect} key={index}/></>
                ))}
            </Stack>
            {bleDevices.length === 0 && (
                <Typography variant="body1">No devices paired yet.</Typography>
            )}
            <Box mt={2}>
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
            </Box>
        </Box>
    );

    return (
        <Box>
            <Typography variant="h5">Paired BLE Devices</Typography>
            <Grid container spacing={2}>
                {bleDevices.map((device, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <DeviceCard device={device} onConnect={onConnect} />
                    </Grid>
                ))}
            </Grid>
            {bleDevices.length === 0 && (
                <Typography variant="body1">No devices paired yet.</Typography>
            )}
            <Box mt={2}>
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
            </Box>
        </Box>
    );
}