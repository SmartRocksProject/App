
// React
import * as React from 'react';
import { Constants, IBLEConnection } from '@smartrocksproject/meshtasticjs';

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// Local
import { DataStoreContext } from '../../dataStore';


// AddDeviceDialog Component
export default function AddDeviceDialog({ ...props }) {

    // Get data store
    const { openDeviceDialog, setOpenDeviceDialog } = React.useContext(DataStoreContext);
    const { bleDevices, setBleDevices } = React.useContext(DataStoreContext);
    const { activeConnection, setActiveConnection } = React.useContext(DataStoreContext);

    // Handle Close
    const handleClose = () => {
        setOpenDeviceDialog(false);
    };
    
    const randId = () => {return Math.floor(Math.random() * 1e9);};

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
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={openDeviceDialog}
            onClose={handleClose}
            {...props}
        >
            <DialogTitle>Add Device</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Some text here to add a device. 
                </DialogContentText>
                <Box
                    noValidate
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        m: 'auto',
                        width: 'fit-content',
                    }}
                >
                    Hello
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}