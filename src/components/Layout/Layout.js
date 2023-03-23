
// React
import React from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Outlet, useNavigate  } from "react-router-dom";

// Material UI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Paper from '@mui/material/Paper';

// Material UI: Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import ArchiveIcon from '@mui/icons-material/Archive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';

// Local Components
import AppBar from './Appbar';
import Drawer from './Sidebar';


// Create list of buttons for the sidebar
const navButtons = [
    {
        text: 'Home',
        icon: <HomeIcon />,
        link: '/',
    },
    {
        text: 'Notification',
        icon: <NotificationsIcon />,
        link: '/notification',
    },
    {
        text: 'Devices',
        icon: <PhonelinkSetupIcon />,
        link: '/devices',
    },
    {
        text: 'Settings',
        icon: <SettingsIcon />,
        link: '/settings',
    },
];


// Layout Component
export default function Layout({ children }) {
    const [open, setOpen, removeOpen] = useLocalStorage('openDrawer');
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    // const [value, setValue] = React.useState(0);


    return (
        <Box sx={{ mt: 10, ml: open ? 30 : 10, mr: 2 }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} handleDrawerToggle={toggleDrawer} navButtons={navButtons}/>
            <Drawer open={open} navButtons={navButtons}/>
            <Box sx={{ p: 3,}}>
                <Outlet />
            </Box>
            <Paper elevation={3} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { sm: 'block', md: 'none' } , }} >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        // use navigate to go to the link of the selected button
                        navigate(navButtons[newValue].link);
                    }}
                >
                    { navButtons.map((button, index) => (
                        <BottomNavigationAction key={index} label={button.text} icon={button.icon} />
                    ))}
                </BottomNavigation>
            </Paper>
        </Box>
    );
}