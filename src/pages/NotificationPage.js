
// React 
import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';
import { useSnackbar } from 'notistack';
import { ExportToCsv } from 'export-to-csv';

// Material UI
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// Material UI Icons
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Local
import { DataStoreContext } from '../dataStore';



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

                            {/*  */}
                            <Button variant="outlined" color="primary" onClick={handleReadNotifications}>
                                Mark All Read
                            </Button>

                            {/* Export all data that is currently in the table (ignore pagination, sorting, filtering, etc.) */}
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleExportData}
                                startIcon={<FileDownloadIcon />}
                            >
                                Export All Data
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

                            {/* Delete all data */}
                            <Button variant="outlined" color="error" onClick={handleDeleteAll}>
                                Delete All
                            </Button>

                        </Box>
                    )}
                />
            </ThemeProvider>
        </Box>
    );
}