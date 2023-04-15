
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Local
import { DataStoreContext } from '../dataStore';
import { onConnect, requestNewDevice, randId, handleXModemOperation } from '../util';
import DeviceCard from '../components/Card/DeviceCard';


// // Generate a random ID
// const randId = () => {
//     return Math.floor(Math.random() * 1e9);
// };

// Devices Page Component
export default function DevicesPage() {

    // Get data store context
    const { deviceList, setDeviceList } = React.useContext(DataStoreContext);
    const { openDeviceDialog, setOpenDeviceDialog } = React.useContext(DataStoreContext);

    const { bleDevices, setBleDevices } = React.useContext(DataStoreContext);
    const { activeConnection, setActiveConnection } = React.useContext(DataStoreContext);

    // console.log('deviceList', deviceList);

    // Open the device dialog
    const handleOpenDeviceDialog = () => {
        setOpenDeviceDialog(true);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{p: 2}}>Paired BLE Devices</Typography>
            <Grid container spacing={2}>
                {deviceList.map((device, index) => (
                    <Grid item xs={12} sm={12} md={12} key={index}>
                        <DeviceCard device={device} onClick={() => onConnect(device, setActiveConnection)} />
                    </Grid>
                ))}
                {deviceList.length === 0 && (
                    <Grid item xs={12} sm={12} md={12}>
                        <Card
                            sx={{
                                border: '1px dashed gray', // Add a gray dashed border
                                background: 'rgba(0, 0, 0, 0.05)', // Add a light gray background color
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    No devices paired. Click the button below to add a real or simulated device.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleOpenDeviceDialog}>
                    Add New Device
                </Button>
                {/* <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleXModemOperation(activeConnection)}
                    disabled={!activeConnection}
                >
                    Use XModem
                </Button> */}
            </Box>
        </Box>
    );
}