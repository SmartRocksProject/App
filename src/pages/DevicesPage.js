
// React 
import React from 'react';
import { Constants, IBLEConnection, Protobuf } from '@smartrocksproject/meshtasticjs';
import { useSnackbar } from 'notistack';

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
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip'
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/Apps';

// Local
import { DataStoreContext, subscribeAll, parseLogFile, canAddLogEvent } from '../dataStore';
import { onConnect, requestNewDevice, randId, handleXModemOperation } from '../util';
import DeviceCard from '../components/Card/DeviceCard';
import UpdateSettingsDialog from '../components/Dialog/updateSettingsDialog';


// Devices Page Component
export default function DevicesPage() {

    // Get data store context
    const { deviceList, setDeviceList } = React.useContext(DataStoreContext);
    const { activeConnection, setActiveConnection } = React.useContext(DataStoreContext);
    const { openDeviceDialog, setOpenDeviceDialog } = React.useContext(DataStoreContext);
    const { logEvents, setLogEvents } = React.useContext(DataStoreContext);
    const { notifications, setNotifications } = React.useContext(DataStoreContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // Local state
    const [viewMode, setViewMode] = React.useState('list');
    const [openUpdateSettingsDialog, setOpenUpdateSettingsDialog] = React.useState(false);

    // Open the device dialog
    const handleOpenDeviceDialog = () => {
        setOpenDeviceDialog(true);
    };

    console.log(deviceList);

    // Connect to the device
    const handleConnect = async (device, index) => {

        // Generate a random ID
        const id = randId();

        // Create a new connection
        const connection = new IBLEConnection(id);

        // Attempt to connect to the device
        try {

            // Connect to the device
            await connection.connect({ device: device.BLEDevice, });
            console.log('Connected to', device.BLEDevice);

            // Set the active connection
            setActiveConnection(connection);

            // Subscribe to all messages
            subscribeAll(device, connection);

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

            // // Subscribe config packets
            // connection.events.onConfigPacket.subscribe(function (config) {
            //     device.setConfig(config);
            //     console.log("Config set!", config.payloadVariant.value);
            //     console.log(device);
            // });

            // // Subscribe module config packets
            // connection.events.onModuleConfigPacket.subscribe(function (moduleConfig) {
            //     device.setModuleConfig(moduleConfig);
            //     console.log("Module config set!", moduleConfig);
            // });

            // Open the snackbar
            enqueueSnackbar('The device has successfully connected!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center', } });

        } catch (error) {
            // Show the error
            console.error('Failed to connect:', error);
            enqueueSnackbar('Failed to connect to the device!', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
        }
    };

    // Update settings on the device
    const handleUpdateSettings = async () => {

        // Check if there is an active connection
        if (activeConnection) {

            // Open the update settings dialog
            setOpenUpdateSettingsDialog(true);

            // Get the device
            const device = activeConnection;

            // Create the protobuf object
            const loraConfig = new Protobuf.Config_LoRaConfig({
                usePreset: true, // true to use a preset, false to use custom settings
                // modemPreset: Protobuf.Config_LoRaConfig_ModemPreset.Bw125Cr45Sf128, // a preset from the available ModemPreset values
                region: Protobuf.Config_LoRaConfig_RegionCode.US, // a region from the available RegionCode values
                // other properties if needed
            });

            const channelSet = new Protobuf.ChannelSet({
                settings: [], // an array of channel settings (Protobuf.ChannelSettings objects)
                loraConfig: loraConfig, // the loraConfig object created in step 2
            });              

            // // Attempt to set the config on the device 
            // try {
                
            //     // Set the config
            //     await device.setConfig(
            //         new Protobuf.Config({
            //             payloadVariant: {
            //                 case: "lora",
            //                 value: loraConfig
            //             }
            //         })
            //     );
                
            //     // Commit config
            //     await device.commitEditSettings();

            //     console.log('Config set!');

            //     // Open the snackbar
            //     enqueueSnackbar('The device has successfully updated!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center', } });

            // } catch (error) {
                 
            //     // Show the error
            //     console.error('Failed to set config:', error);
            //     enqueueSnackbar('Failed to update the device!', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
            // }


        } else {
            
            // Alert the user
            enqueueSnackbar('No active connection!', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
        }
    };

    // Use XModem to download a file
    const handleDownloadFile = async () => {

        // Check if there is an active connection
        if (activeConnection) {

            // Get the XModem object
            const xmodem = activeConnection.XModem;
            try {

                // Download the file
                const filename = '/Masterfile.txt'; // Replace with the desired filename
                const result = await xmodem.downloadFile(filename);
                console.log(`XModem downloadFile result: ${result}`);

                // Save the file result to the device
                setDeviceList((prev) => {
                    
                    // Copy the array
                    const newDevices = [...prev];

                    // Find the device
                    const device = newDevices.find((device) => device.isConnected);

                    // Save the file result
                    device.logFile = result;
                    device.logData = parseLogFile(result);

                    // Update the notifications
                    let newNotifications = 0;
                    for (let log of device.logData) {

                        // If the log event can be added, increment the notifications and add it
                        if (canAddLogEvent(logEvents, log) && log) {

                            console.log('Adding log event: ' + log);

                            // Increment the notifications
                            newNotifications += 1;

                            // Add the log event to the setLogEvents
                            setLogEvents(prevLogEvents => [...prevLogEvents, log]);
                        }
                    }

                    // Set the notifications
                    setNotifications(notifications + newNotifications);

                    // Return the new array
                    return newDevices;
                });

                // Open the snackbar
                enqueueSnackbar('The file has successfully downloaded!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center', } });

            } catch (error) {
                console.error('Error using XModem downloadFile:', error);
                enqueueSnackbar('Failed to download the file!', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
            }
        } else {
            console.error('No active connection');
            enqueueSnackbar('No active connection!', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
        }
    };

    // Handle the delete button
    const handleDelete = (device, index) => {
        setDeviceList((prev) => {
            const newDevices = [...prev];
            newDevices.splice(index, 1);
            return newDevices;
        });

        // Alert the user
        enqueueSnackbar('The device has been removed!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
    };
    
    // Determine if connect button should be shown
    const showConnectButton = (device) => {
        
        // If this is a real device
        if (device.isReal) {

            // If the device is not connected
            if (!device.isConnected) {
                return true;
            } else {
                return false;
            }
        }

        // Otherwise, return false
        return false;
    };

    // Determine if download button should be shown
    const showDownloadButton = (device) => {
        
        // If this is a real device
        if (device.isReal) {

            // If the device is connected
            if (device.isConnected) {
                return true;
            } else {
                return false;
            }
        }

        // Otherwise, return false
        return false;
    };

    return (
        <Box>

            {/* Heading */}
            <Typography variant="h6" sx={{ p: 2 }}>
                Paired BLE Devices
            </Typography>

            {/* List of devices */}
            <Grid container spacing={2}>
                {deviceList.map((device, index) => (
                    <Grid item xs={12} key={index}>
                        <DeviceCard
                            device={device}
                            handleConnect={() => handleConnect(device, index)}
                            handleDownloadFile={() => handleDownloadFile()}
                            handleDelete={() => handleDelete(device, index)}
                            showConnectButton={showConnectButton(device)}
                            showDownloadButton={showDownloadButton(device)}
                            handleUpdateSettings={() => handleUpdateSettings()}
                        />

                        {/* Device dialog */}
                        <UpdateSettingsDialog
                            open={openUpdateSettingsDialog}
                            setOpen={setOpenUpdateSettingsDialog}
                            device={device}
                        />

                    </Grid>
                ))}
                {deviceList.length === 0 && (
                    <Grid item xs={12}>
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

            {/* Add new device button */}
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleOpenDeviceDialog}>
                    Add New Device
                </Button>
            </Box>

        </Box>
    );
}