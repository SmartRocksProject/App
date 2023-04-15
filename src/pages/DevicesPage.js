
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
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip'
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/Apps';

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

    // Local state
    const [viewMode, setViewMode] = React.useState('list');

    // Open the device dialog
    const handleOpenDeviceDialog = () => {
        setOpenDeviceDialog(true);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
                <Typography variant="h6" sx={{ flexGrow: 1, }}>
                    Paired BLE Devices
                </Typography>
                <Tooltip title="Switch view from grid/list">
                    <IconButton onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
                        {viewMode === 'list' ? (
                            <ViewModuleIcon sx={{ fontSize: 35 }} />
                        ) : (
                            <ViewListIcon sx={{ fontSize: 35 }} />
                        )}
                    </IconButton>
                </Tooltip>
            </Box>

            <Grid container spacing={2}>
                {deviceList.map((device, index) => (
                    <Grid item xs={12} sm={viewMode === 'list' ? 12 : 6} md={viewMode === 'list' ? 12 : 4} key={index}>
                        <DeviceCard device={device} index={index} />
                    </Grid>
                ))}
                {deviceList.length === 0 && (
                    <Grid item xs={12} sm={viewMode === 'list' ? 12 : 6} md={viewMode === 'list' ? 12 : 4}>
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