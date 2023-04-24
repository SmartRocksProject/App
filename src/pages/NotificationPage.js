
// React 
import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import { useSnackbar } from 'notistack';
import { ExportToCsv } from 'export-to-csv';
import CSVReader from 'react-csv-reader';

// Material UI
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Material UI Icons
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import FileUploadIcon from '@mui/icons-material/FileUpload';

// Local
import { DataStoreContext, canAddLogEvent } from '../dataStore';



// Notifcation Page Component
export default function Notification() {

    // Data Store
    const { darkMode, setDarkMode } = React.useContext(DataStoreContext);
    const { logEvents, setLogEvents } = React.useContext(DataStoreContext);
    const { notifications, setNotifications } = React.useContext(DataStoreContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // Theming
    const globalTheme = useTheme();
    const lightTableTheme = useMemo(
        () =>
            createTheme({
                palette: { 
                    mode: "light",
                    background: {
                        default: "rgb(254,255,244)"
                    },
                },
            }),
        [globalTheme],
    );
    const darkTableTheme = useMemo(
        () =>
        createTheme({ 
            palette: { mode: "dark", },
        }),
        [globalTheme],
    );

    // Table columns: should be memoized or stable
    const columns = useMemo(
        () => [
            {
                accessorKey: 'nodeNum',
                header: 'ID',
            },
            {
                accessorKey: 'detectionType',
                header: 'Detection Type',
            },
            {
                accessorKey: 'dateTime',
                header: 'Date Time',
            },
            {
                accessorKey: 'gpsData',
                header: 'GPS Position',
            },
        ],
        [],
    );

    // Render a list of event logs in proper format from logEvents
    const TableLogEvents = [];

    // get detection name
    const getDetectionName = (detectionType) => {
        if (detectionType === 'S') {
            return 'Seismic Activity Detected';
        } else if (detectionType === 'V') {
            return 'Voice Activity Detected';
        } else {
            return 'N/A';
        }
    }

    // For each log event, create a new table row
    for (let i = 0; i < logEvents.length; i++) {
        TableLogEvents[i] = {
            nodeNum: logEvents[i].nodeId,
            dateTime: `${logEvents[i].year}-${logEvents[i].month}-${logEvents[i].day} ${logEvents[i].hour}:${logEvents[i].minute}:${logEvents[i].second}`,
            detectionType: getDetectionName(logEvents[i].detectionType),
            gpsData: `${logEvents[i].latDeg}°${logEvents[i].latMin}'${logEvents[i].latSec}"${logEvents[i].latCP}, ${logEvents[i].lonDeg}°${logEvents[i].lonMin}'${logEvents[i].lonSec}"${logEvents[i].lonCP}`,
        };
    }

    // Export Data
    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: columns.map((c) => c.header),
    };

    const csvExporter = new ExportToCsv(csvOptions);

    // Handle Export Buttons
    const handleExportRows = (rows) => {
        csvExporter.generateCsv(rows.map((row) => row.original));
    };

    // Handle Export All Data Button
    const handleExportData = () => {
        csvExporter.generateCsv(TableLogEvents);
    };

    // Handle Read Notifications Button
    const handleReadNotifications = () => {
        setNotifications(0);
        enqueueSnackbar('Notifications marked as read!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
    };

    // Handle Delete All Button
    const handleDeleteAll = () => {
        setLogEvents([]);
        enqueueSnackbar('All notifications deleted!', { variant: 'warning', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
    };

    // Handle Import Button
    const handleCsvData = (data) => {
        const newLogEvents = data.slice(1).map((row) => {
            const [
                nodeNum,
                dateTime,
                detectionType,
                gpsData,
            ] = row;

            // Check if the row is valid
            if (!gpsData) return null;

            // Parse date and time
            const time = dateTime.split(' ')[1];
            const seconds = parseInt(time.split(':')[2]);

            // Parse GPS data
            const [lat, lon] = gpsData.split(',').map((coord) => coord.trim());
            const latMatch = lat.match(/(\d+)°(\d+)'(\d+(?:\.\d+)?)\"([NS])/);
            const lonMatch = lon.match(/(\d+)°(\d+)'(\d+(?:\.\d+)?)\"([EW])/);

            // Check if the GPS data is valid
            if (!latMatch || !lonMatch) {
                enqueueSnackbar('Invalid GPS data format in the CSV file', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
                return null;
            }

            // Parse the GPS data
            const [_, latDeg, latMin, latSec, latCP] = latMatch;
            const [__, lonDeg, lonMin, lonSec, lonCP] = lonMatch;

            // Return the parsed data
            return {
                nodeId: parseInt(nodeNum),
                detectionType: detectionType === 'Seismic Activity Detected' ? 'S' : 'V',
                year: parseInt(dateTime.substring(0, 4)),
                month: parseInt(dateTime.substring(5, 6)),
                day: parseInt(dateTime.substring(8, 9)),
                hour: parseInt(dateTime.substring(11, 13)),
                minute: parseInt(dateTime.substring(14, 16)),
                second: parseInt(seconds),
                latDeg: parseInt(latDeg),
                latMin: parseInt(latMin),
                latSec: parseFloat(latSec),
                latCP: latCP,
                lonDeg: parseInt(lonDeg),
                lonMin: parseInt(lonMin),
                lonSec: parseFloat(lonSec),
                lonCP: lonCP,
            };
        }).filter(event => event !== null);

        // Update the notifications
        const newFilteredLogEvents = newLogEvents.filter((log) => canAddLogEvent(logEvents, log) && log);

        // Increment the notifications
        setNotifications((prevNotifications) => prevNotifications + newFilteredLogEvents.length);

        // Add the new log events to the existing log events
        setLogEvents((prevLogEvents) => [...prevLogEvents, ...newFilteredLogEvents]);

    };

    return (
        <Box sx={{}}>
            <Box sx={{ display: 'flex', alignItems: 'center', p: 2, }}>
                <Typography variant="h5" sx={{flexGrow: 1}}>Notifications</Typography>
            </Box>
            <ThemeProvider theme={darkMode ? darkTableTheme : lightTableTheme }>
                <MaterialReactTable
                    columns={columns}
                    data={TableLogEvents}
                    enableRowSelection
                    enableColumnOrdering
                    enablePinning
                    renderTopToolbarCustomActions={({ table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem', flexWrap: 'wrap' }}>

                            {/* Mark all read */}
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                onClick={handleReadNotifications} 
                                startIcon={<NotificationsActiveIcon />}
                            >
                                Mark All Read
                            </Button>

                            {/* Export all data that is currently in the table (ignore pagination, sorting, filtering, etc.) */}
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleExportData}
                                startIcon={<FileDownloadIcon />}
                            >
                                Export
                            </Button>

                            {/* <Button
                                disabled={table.getPrePaginationRowModel().rows.length === 0}
                                //export all rows, including from the next page, (still respects filtering and sorting)
                                onClick={() =>
                                    handleExportRows(table.getPrePaginationRowModel().rows)
                                }
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                            >
                                Export All Rows
                            </Button> */}

                            {/* Export only selected rows */}
                            {/* <Button
                                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                                onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                                startIcon={<FileDownloadIcon />}
                                variant="contained"
                            >
                                Export Selected Rows
                            </Button> */}

                            {/* Import CSV file */}
                            <label htmlFor="csv-input">
                                <Button variant="outlined" color="primary" component="span" startIcon={<FileUploadIcon />}>
                                    Import
                                </Button>
                            </label>
                            <CSVReader
                                cssClass="csv-input"
                                onFileLoaded={handleCsvData}
                                onError={(err) => enqueueSnackbar(`Error uploading CSV file: ${err}`, { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center', } })}
                                parserOptions={{ header: false }}
                                inputId="csv-input"
                                inputStyle={{ display: 'none' }}
                            />
                            
                            {/* Delete all data */}
                            <Button variant="outlined" color="error" onClick={handleDeleteAll} startIcon={<DeleteIcon />}>
                                Delete All
                            </Button>

                        </Box>
                    )}
                />
            </ThemeProvider>
        </Box>
    );
}