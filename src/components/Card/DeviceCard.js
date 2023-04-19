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

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';

// Local
import { DataStoreContext } from '../../dataStore';
import { randId } from '../../util';
import { Anchor } from '@mui/icons-material';


// A card that displays a device and its details
export default function DeviceCard({ device, handleConnect, handleDownloadFile, handleDelete, showConnectButton, showDownloadButton, ...props }) {

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

        // Check if device.logData[0] exists
        if (device.logData[0]) {

            console.log(device.logData[0]);
            
            if (device.logData[0].detectionType === "S") {
                detectionMessage = 'Human Seismic Activity Detected!';
            }
            else if (device.logData[0].detectionType === "V") {
                detectionMessage = 'Human Vibration Activity Detected!';
            }
            else if (device.logData[0].detectionType === "B") {
                detectionMessage = 'Battery Levels Low!';
            }
        }

        // Otherwise, no detection data exists. No data to display.
        else {
            detectionMessage = 'Unknown';
        }
        return detectionMessage;
    }
    

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
                {/* <Link to={`/devices/${device.id}`} style={{  }}> */}
                    <Typography variant="h5" sx={{ py: 2 }}>
                        {device.name}
                    </Typography>
                {/* </Link> */}
                <Typography variant="body2" color="text.secondary">
                    • GPS: {getGPSMessage()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    • Last log message: {getDetectionMessage()}
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
                    <AccordionDetails>
                        <pre>
                            {device.logFile}
                        </pre>
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
