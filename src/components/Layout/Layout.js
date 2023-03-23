
// React
import React from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Outlet, useNavigate  } from "react-router-dom";
import { Link } from 'react-router-dom';

// Material UI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Paper from '@mui/material/Paper';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';

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
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Local Components
import AppBar from './Appbar';
// import Drawer from './Sidebar';


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

// The List Components 
function ListComponent({ navButtons, open }) {
    return (
        <List>
            <Divider sx={{ mt: 7.5, }} />

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

// Layout Component: A reusable component that can be used for any page. Works using react-router-dom. 
export default function Layout({ children }) {
    const theme = useTheme();
    const isMD = useMediaQuery(theme.breakpoints.up('md'));
    const [open, setOpen, removeOpen] = useLocalStorage('openDrawer');
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    // const [value, setValue] = React.useState(0);

    const drawerWidthOpen = 240;
    const drawerWidthClosed = 60;

    return (
        <Box sx={{ p: 2 }}>
            <CssBaseline />

            {/* Appbar component */}
            <AppBar position="fixed" open={open} handleDrawerToggle={toggleDrawer} navButtons={navButtons}/>

            {/* Sidebar component */}
            {/* <Drawer open={open} navButtons={navButtons}/> */}
            { isMD 
                ? 
                <Drawer 
                    variant="permanent" 
                    open={open} 
                    // sx={{ width: open ? drawerWidthOpen : drawerWidthClosed , }}
                    PaperProps={{ style: { width: open ? drawerWidthOpen : drawerWidthClosed } }}
                >
                    <ListComponent navButtons={navButtons} open={open} />
                </Drawer>
                :    
                <SwipeableDrawer
                    anchor='left'
                    open={open}
                    onClose={toggleDrawer}
                    // sx={{ width: drawerWidth, }}
                    PaperProps={{ style: { width: open ? drawerWidthOpen : drawerWidthClosed } }}
                >
                    <ListComponent navButtons={navButtons} open={open} />
                </SwipeableDrawer>
            }

            {/* Main page content goes here */}
            <Box sx={{ mt: 10, ml: isMD ? ( open ? 30 : 10 ) : 0 }}>
                <Outlet />
            </Box>

            {/* Bottom navigation */}
            <Paper elevation={3} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { sm: 'block', md: 'none' } , }} >
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                        navigate(navButtons[newValue].link); // Navigate to the page
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