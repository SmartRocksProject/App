// React
import * as React from 'react';

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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';

// Local
import { DataStoreContext, Device, Log, parseLogData } from '../../dataStore';
import { onConnect, requestNewDevice, randId } from '../../util';


// AddDeviceDialog Component
export default function AddDeviceDialog({ ...props }) {

    // Get data store
    const { deviceList, setDeviceList } = React.useContext(DataStoreContext);
    const { openDeviceDialog, setOpenDeviceDialog } = React.useContext(DataStoreContext);
    const { activeConnection, setActiveConnection } = React.useContext(DataStoreContext);

    // Local state to store list of real BLE connections
    const [bleDevices, setBleDevices] = React.useState([]);

    // State to store the device type selection
    const [deviceType, setDeviceType] = React.useState('real');

    // Create a new state for the simulated device form values
    const [simulatedDevice, setSimulatedDevice] = React.useState(Device);

    // Handle Close
    const handleClose = () => {
        setOpenDeviceDialog(false);
    };

    // Determine if the form submission button should be enabled
    const isSubmitEnabled = () => {
        
        // Handle real device form submission
        if (deviceType === 'real') {
            return bleDevices.length > 0;
        } 

        // Handle simulation device form submission
        else if (deviceType === 'simulated') {
            if (simulatedDevice.name === '') return false;
            else {
                return true;
            }
        }

        // Default to false
        return false;
    };
      
    // Handle the form submission
    const handleFormSubmit = (event) => {
        event.preventDefault();

        if (deviceType === 'real') {
            // Handle real device form submission
            const newDevice = {
                ...Device,
                id: deviceList.length + 1,
                deviceType: 'real',
                BleDevice: bleDevices[0],
                name: bleDevices[0].name,
                connection: onConnect(bleDevices[0]),
                logData: [],
            };

            // Add the new device to the device list
            setDeviceList((prevDevices) => [...prevDevices, newDevice]);
            setBleDevices([]);
            
        } else if (deviceType === 'simulated') {
            // Handle simulation device form submission
            const newDevice = {
                ...simulatedDevice,
                id: deviceList.length + 1,
                deviceType: 'simulated',
                logFile: simulatedDevice.logFile,
                logData: parseLogData(simulatedDevice.logFile),
            };

            // Add the new device to the device list
            setDeviceList((prevDevices) => [...prevDevices, newDevice]);
            
        }

        setSimulatedDevice(Device);
        setOpenDeviceDialog(false);
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
                    Select the type of device you want to add.
                </DialogContentText>
                <FormControl component="fieldset" sx={{ pb: 5, }}>
                    <RadioGroup
                        row
                        aria-label="device-type"
                        name="device-type"
                        value={deviceType}
                        onChange={(e) => setDeviceType(e.target.value)}
                    >
                        <Tooltip title="Connect to a real device">
                            <FormControlLabel
                                value="real"
                                control={<Radio />}
                                label="Real Device"
                            />
                        </Tooltip>
                        <Tooltip title="Add a simulated device for testing UI">
                            <FormControlLabel
                                value="simulated"
                                control={<Radio />}
                                label="Simulation"
                            />
                        </Tooltip>
                    </RadioGroup>
                </FormControl>
                {deviceType === 'real' && (
                    <Box
                        id="real-form" // Add the id attribute
                        noValidate
                        component="form"
                        onSubmit={handleFormSubmit} // Add the onSubmit attribute            
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                        }}
                    >
                        {/* Add options for real device here */}
                        <DialogContentText>
                            Add a real device:
                        </DialogContentText>
                        <List>
                            {bleDevices.map((device, index) => (
                                <ListItem
                                    key={index}
                                    button
                                    // onClick={() => onConnect(device, setActiveConnection)}
                                    // sx={{ backgroundColor: 'lightgreen' }}
                                >
                                    <ListItemText primary={device.name} />
                                </ListItem>
                            ))}
                            {bleDevices.length === 0 && (
                                <ListItem>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddIcon />}
                                        onClick={() => requestNewDevice(setBleDevices)}
                                    >
                                        Add New Device
                                    </Button>
                                </ListItem>
                            )}
                        </List>
                    </Box>
                )}
                {deviceType === 'simulated' && (
                    <Box
                        id="simulation-form" // Add the id attribute
                        component="form"
                        onSubmit={handleFormSubmit} // Add the onSubmit attribute
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            // width: 'fit-content',
                        }}
                    >
                        {/* Add options for simulation testing device here */}
                        <DialogContentText sx={{mb: 2,}}>
                            Add a simulated device (for testing purposes):
                        </DialogContentText>
                        <Stack spacing={2}>
                            <Tooltip title="Enter the device name">
                                <TextField
                                    label="Device Name"
                                    value={simulatedDevice.name}
                                    onChange={(e) => setSimulatedDevice({ ...simulatedDevice, name: e.target.value })}
                                    required={true}
                                />
                            </Tooltip>
                            {/* <Stack direction="row" spacing={2}>
                                <Tooltip title="Enter the GPS latitude">
                                    <TextField
                                        label="GPS Latitude"
                                        type="number"
                                        value={simulatedDevice.GPS.lat}
                                        onChange={(e) => setSimulatedDevice({ ...simulatedDevice, GPS: { ...simulatedDevice.GPS, lat: parseFloat(e.target.value) } })}
                                        required={true}
                                    />
                                </Tooltip>
                                <Tooltip title="Enter the GPS longitude">
                                    <TextField
                                        label="GPS Longitude"
                                        type="number"
                                        value={simulatedDevice.GPS.lon}
                                        onChange={(e) => setSimulatedDevice({ ...simulatedDevice, GPS: { ...simulatedDevice.GPS, lon: parseFloat(e.target.value) } })}
                                        required={true}
                                    />
                                </Tooltip>
                                <Tooltip title="Enter the GPS altitude">
                                    <TextField
                                        label="GPS Altitude"
                                        type="number"
                                        value={simulatedDevice.GPS.alt}
                                        onChange={(e) => setSimulatedDevice({ ...simulatedDevice, GPS: { ...simulatedDevice.GPS, alt: parseFloat(e.target.value) } })}
                                        required={true}
                                    />
                                </Tooltip>
                            </Stack> */}
                            <Tooltip title="Enter the log file content">
                                <TextField
                                    label="Log File"
                                    multiline
                                    value={simulatedDevice.logFile}
                                    onChange={(e) => setSimulatedDevice({...simulatedDevice, logFile: e.target.value})}
                                />
                            </Tooltip>
                        </Stack>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    form={deviceType === 'simulated' ? 'simulation-form' : 'real-form'} 
                    variant="contained" 
                    color="primary"
                    disabled={!isSubmitEnabled()}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );

}
    
            
