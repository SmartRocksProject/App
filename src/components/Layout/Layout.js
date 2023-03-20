
// React
import React from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Outlet } from "react-router-dom";

// Material UI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DrawerHeader from '@mui/material/Drawer';

// Material UI: Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

// Local Components
import AppBar from './Appbar';
import Drawer from './Drawer';


// Layout Component
export default function Layout({ children }) {
    const [open, setOpen, removeOpen] = useLocalStorage('openDrawer');
    // const [open, setOpen] = React.useState(false);
    const theme = useTheme();

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ mt: 10, ml: open ? 30 : 10, mr: 2 }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} handleDrawerToggle={toggleDrawer}/>
            <Drawer variant="permanent" open={open} />
            <Box sx={{ p: 3,}}>
                <Outlet />
            </Box>
        </Box>
    );
}