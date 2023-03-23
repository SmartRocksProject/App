
// React
import React from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Link } from 'react-router-dom';

// Material UI
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

// Material UI: Icons
import AddCircleIcon from '@mui/icons-material/AddCircle';


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

// The List Components 
function ListComponent({ navButtons, open }) {
    return (
        <List>
            {navButtons.map((item, index) => (
                <ListItem disablePadding sx={{ display: 'block' }} key={index}>
                    <ListItemButton component={Link} to={item.link} sx={{
                        minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,
                    }}>
                        <ListItemIcon sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                        }}>
                            <Badge color="error" badgeContent={0}>
                                {item.icon}
                            </Badge>
                        </ListItemIcon>
                        <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                </ListItem>
            ))}

            <Divider />

            <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton sx={{
                    minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5,
                }}>
                    <ListItemIcon sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                    }}>
                        <AddCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Connect"} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
            </ListItem>

        </List>
    );
}

export default function MiniDrawer({ open, handleToggle, navButtons, ...props }) {

    // // If mobile or tablet, then use temporary drawer
    // const theme = useTheme();
    // const isMD = useMediaQuery(theme.breakpoints.up('md'));

    // console.log("isMD: ", isMD);

    // if (!isMD) {
    //     return (
    //         <SwipeableDrawer
    //             anchor="left"
    //             open={open}
    //         >
    //             <ListComponent navButtons={navButtons} open={open} />
    //         </SwipeableDrawer>
    //     );
    // }

    return (
        <Drawer variant="permanent" open={open} {...props}>
            <Divider sx={{ mt: 8, }} />
            <ListComponent navButtons={navButtons} open={open}/>
        </Drawer>
    );
}