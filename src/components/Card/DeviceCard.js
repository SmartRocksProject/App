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
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';

// Local
import { DataStoreContext, displayGPS, displayMessageType, getTime } from '../../dataStore';
import { randId } from '../../util';


// A card that displays a device and its details
export default function DeviceCard({ device, handleConnect, handleDownloadFile, 
    handleDelete, showConnectButton, showDownloadButton, handleUpdateSettings, ...props }) {

    // Theme
    const theme = useTheme();

    // States
    const { deviceList, setDeviceList } = React.useContext(DataStoreContext);
    const { activeConnection, setActiveConnection } = React.useContext(DataStoreContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    return (
        <Card {...props}>
            <CardContent>
                <Stack direction="row" spacing={1}>
                    { device.isReal ?
                        <Chip label="Real Device" color="success" variant="outlined" />
                        :
                        <Chip label="Simulated Device" color="warning" variant="outlined" />
                    }
                </Stack>
                <Typography variant="h5" sx={{ py: 2 }}>
                    {device.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Last log message:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    • GPS: {String(displayGPS(device.logData[device.logData.length - 1]))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    • Last log message: {String(displayMessageType(device.logData[device.logData.length - 1]))}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    • Time: {String(getTime(device.logData[device.logData.length - 1]))}
                </Typography>

                {/* Display the log file as code block */}
                <Accordion sx={{
                    m: -2,
                    mt: 2,
                    boxShadow: "none",
                    "&:before": {
                        display: "none",
                    },
                }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>View Raw Log File</Typography>
                    </AccordionSummary>
                    <AccordionDetails >
                        <Box sx={{ backgroundColor: theme.palette.action.selected }} >
                            <pre>
                                {device.logFile}
                            </pre>
                        </Box>
                    </AccordionDetails>
                </Accordion>

            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={handleConnect}
                    disabled={showConnectButton ? false : true}
                    variant="outlined"
                >
                    Connect
                </Button>
                <Button 
                    size="small" 
                    variant="outlined" 
                    color="primary" 
                    onClick={handleDownloadFile}
                    disabled={showDownloadButton ? false : true}
                >
                    Download Logfile
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    size="small"
                    color="primary"
                    onClick={handleUpdateSettings}
                    variant="text"
                    disabled={showDownloadButton ? false : true}
                >
                    Update Settings
                </Button>
                <Button 
                    size="small" 
                    variant="outlined" 
                    color="error"
                    onClick={handleDelete}
                >
                    Remove
                </Button>
            </CardActions>
        </Card>
    );
};
