// React
import React from 'react';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Constants, IBLEConnection } from '@smartrocksproject/meshtasticjs';

// Material UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';

// Local
import { DataStoreContext } from '../../dataStore';
import { randId } from '../../util';
import { Anchor } from '@mui/icons-material';

// A card that displays a device and its details
export default function DeviceCard({ device, index, ...props }) {

    // States
    const { deviceList, setDeviceList } = React.useContext(DataStoreContext);
    const { activeConnection, setActiveConnection } = React.useContext(DataStoreContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // Get GPS message
    function getGPSMessage() {
        const deviceLogsForId = device.logData.filter((log) => log.deviceId === device.name);

        if (deviceLogsForId.length > 0) {
            const latestLog = deviceLogsForId[deviceLogsForId.length - 1];
            const { latitude, longitude } = latestLog;
            const latString = `${latitude.degrees}° ${latitude.minutes}' ${latitude.seconds}" ${latitude.cardinalPoint}`;
            const lonString = `${longitude.degrees}° ${longitude.minutes}' ${longitude.seconds}" ${longitude.cardinalPoint}`;
            return `${latString}, ${lonString}`;
        } else {
            return `Unknown`;
        }
    }

    // get detection message
    const getDetectionMessage = () => {
        let detectionMessage = null;
        if (device.logData[0].detectionType === "S") {
            detectionMessage = 'Human Seismic Activity Detected!';
        }
        else if (device.logData[0].detectionType === "V") {
            detectionMessage = 'Human Vibration Activity Detected!';
        }
        else if (device.logData[0].detectionType === "B") {
            detectionMessage = 'Battery Levels Low!';
        }
        else {
            detectionMessage = null;
        }
        return detectionMessage;
    }
    
    // Connect to the device
    const onConnect = async () => {

        // Generate a random ID
        const id = randId();

        // Create a new connection
        const connection = new IBLEConnection(id);

        // Attempt to connect to the device
        try {

            // Connect to the device
            await connection.connect({ device: device.BLEDevice,});
            console.log('Connected to', device.BLEDevice);

            // Set the active connection
            setActiveConnection(connection);

            // Show the device as connected
            setDeviceList((prev) => {

                // Copy the array
                const newDevices = [...prev];

                // Set all other devices as disconnected
                newDevices.forEach((device) => {
                    device.isConnected = false;
                });

                // Set the device as connected
                newDevices[index].isConnected = true;

                // Return the new array
                return newDevices;
            });

            // Open the snackbar
            enqueueSnackbar('The device has successfully connected!', {variant: 'success', anchorOrigin: {vertical: 'top', horizontal: 'center',}});

        } catch (error) {
            // Show the error
            console.error('Failed to connect:', error);
            enqueueSnackbar('Failed to connect to the device!', {variant: 'error', anchorOrigin: {vertical: 'top', horizontal: 'center',}});
        }
    };

    // Use XModem to download a file
    const handleXModemOperation = async () => {

        // Check if there is an active connection
        if (activeConnection) {

            // Get the XModem object
            const xmodem = activeConnection.XModem;
            try {

                // Download the file
                const filename = '/Masterfile.txt'; // Replace with the desired filename
                const result = await xmodem.downloadFile(filename);
                console.log(`XModem downloadFile result: ${result}`);
                
                // Open the snackbar
                enqueueSnackbar('The file has successfully downloaded!', {variant: 'success', anchorOrigin: {vertical: 'top', horizontal: 'center',}});

            } catch (error) {
                console.error('Error using XModem downloadFile:', error);
                enqueueSnackbar('Failed to download the file!', {variant: 'error', anchorOrigin: {vertical: 'top', horizontal: 'center',}});
            }
        } else {
            console.error('No active connection');
            enqueueSnackbar('No active connection!', {variant: 'error', anchorOrigin: {vertical: 'top', horizontal: 'center',}});
        }
    };

    // Handle the delete button
    const handleDelete = () => {
        setDeviceList((prev) => {
            const newDevices = [...prev];
            newDevices.splice(index, 1);
            return newDevices;
        });

        // Alert the user
        enqueueSnackbar('The device has been removed!', {variant: 'success', anchorOrigin: {vertical: 'top', horizontal: 'center',}});
    };

    return (
        <Card {...props}>
            <CardContent>
                <Stack direction="row" spacing={1}>
                    { device.deviceType === 'real' && <Chip label="Real Device" color="success" variant="outlined" /> }
                    { device.deviceType === 'simulated' && <Chip label="Simulated Device" color="warning" variant="outlined" /> }
                </Stack>
                <Link to={`/devices/${device.id}`} style={{  }}>
                    <Typography variant="h5" sx={{ py: 2 }}>
                        {device.name}
                    </Typography>
                </Link>
                <Typography variant="body2" color="text.secondary">
                    • GPS: {getGPSMessage()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    • Last log message: {getDetectionMessage()}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => onConnect(device.BLEDevice)}
                    disabled={ device.deviceType === 'simulated' ? true : (device.isConnected ? true : false)}
                    variant="outlined"
                >
                    Connect
                </Button>
                <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => handleXModemOperation()}
                    disabled={ device.deviceType === 'simulated' ? false : (device.isConnected ? false : true)}
                >
                    Download Logfile
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button 
                    size="small" 
                    variant="outlined" 
                    color="error"
                    onClick={() => handleDelete()}
                >
                    Remove
                </Button>
            </CardActions>
        </Card>
    );
};
