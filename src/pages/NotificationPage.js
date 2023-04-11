
// React 
import React, { useMemo } from 'react';
import MaterialReactTable from 'material-react-table';

// Material UI
import { createTheme, ThemeProvider, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';


const notifications = [
    {
        id: 1,
        title: 'Notification 1',
        description: 'This is the description for notification 1.',
        image: 'https://via.placeholder.com/40',
    },
    {
        id: 2,
        title: 'Notification 2',
        description: 'This is the description for notification 2.',
        image: 'https://via.placeholder.com/40',
    },
];


//nested data is ok, see accessorKeys in ColumnDef below
const data = [
    {
        name: {
            firstName: 'John',
            lastName: 'Doe',
        },
        address: '261 Erdman Ford',
        city: 'East Daphne',
        state: 'Kentucky',
    },
    {
        name: {
            firstName: 'Jane',
            lastName: 'Doe',
        },
        address: '769 Dominic Grove',
        city: 'Columbus',
        state: 'Ohio',
    },
    {
        name: {
            firstName: 'Joe',
            lastName: 'Doe',
        },
        address: '566 Brakus Inlet',
        city: 'South Linda',
        state: 'West Virginia',
    },
    {
        name: {
            firstName: 'Kevin',
            lastName: 'Vandy',
        },
        address: '722 Emie Stream',
        city: 'Lincoln',
        state: 'Nebraska',
    },
    {
        name: {
            firstName: 'Joshua',
            lastName: 'Rolluffs',
        },
        address: '32188 Larkin Turnpike',
        city: 'Charleston',
        state: 'South Carolina',
    },
];
  
// Notifcation Page Component
export default function Notification() {

    // Theming
    const globalTheme = useTheme();
    const tableTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    background: {
                        default:
                            globalTheme.palette.mode === 'light'
                                ? 'rgb(254,255,244)' //random light yellow color for the background in light mode
                                : '#000', //pure black table in dark mode for fun
                    },
                },
            }),
        [globalTheme],
    );

    //should be memoized or stable
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name.firstName', //access nested data with dot notation
                header: 'First Name',
            },
            {
                accessorKey: 'name.lastName',
                header: 'Last Name',
            },
            {
                accessorKey: 'address', //normal accessorKey
                header: 'Address',
            },
            {
                accessorKey: 'city',
                header: 'City',
            },
            {
                accessorKey: 'state',
                header: 'State',
            },
        ],
        [],
    );

    return (
        <Box sx={{ }}>
            <Typography variant="h5" sx={{p: 2}}>Notifications</Typography>
            <ThemeProvider theme={tableTheme}>
                <MaterialReactTable
                    columns={columns}
                    data={data}
                    enableRowSelection
                    enableColumnOrdering
                    enablePinning
                />
            </ThemeProvider>
            {/* <List>
                {notifications.map((notification) => (
                    <ListItem key={notification.id} alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={notification.title} src={notification.image} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={notification.title}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {notification.description}
                                    </Typography>
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                ))}
            </List> */}
        </Box>
    );
}