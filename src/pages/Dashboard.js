
// React
import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Popup } from "react-leaflet";
import { MarkerLayer, Marker } from "react-leaflet-marker";
import L from "leaflet";
import markerIcon  from 'leaflet/dist/images/marker-icon-2x.png'


// Material UI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

// Material UI: Icons
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import HelpIcon from '@mui/icons-material/Help';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

function BasicCard() {
    return (
        <Card sx={{  }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    This is some dummy text
                </Typography>
                <Typography variant="h5" component="div">
                    Title to this card
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Need to figure out what to put here
                </Typography>
                <Typography variant="body2">
                    This card should contain some information about the current status of the system.
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}


// Map Component
function MapCard() {

    // Define position for map center
    const position_boston_ma = [42.3584, -71.0598];
    const position_woburn_ma = [42.4793, -71.1523];
    const position_lowell_ma = [42.6334, -71.3162];
    
    // Create a custom marker with MUI star icon
    // const starIcon = new L.icon({
    //     iconUrl: <SvgIcon component={StarIcon} />,
    //     iconSize: [30, 30],
    // });

    return (
        <Card sx={{ height: 500, }}>
            <MapContainer center={position_boston_ma} zoom={10}  style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
                />
                {/* Add any other components you want to display on the map */}
                <MarkerLayer>
                    <Marker position={position_boston_ma}>
                        <img alt="Example image" width={25} height={41} src={markerIcon} />
                    </Marker>
                    <Marker position={position_woburn_ma}>
                        <img alt="Example image" width={25} height={41} src={markerIcon} />
                    </Marker>
                    <Marker position={position_lowell_ma}>
                        <img alt="Example image" width={25} height={41} src={markerIcon} />
                    </Marker>
                </MarkerLayer>
            </MapContainer>
        </Card>
    );
}
  

export default function Dashboard() {

    const position = [51.505, -0.09]
    

    // const Item = >;

    return (
        <Grid container spacing={4} alignItems="stretch" >
            <Grid xs={12} md={8}>
                <MapCard/>
            </Grid>
            <Grid xs={12} md={4}>
                <Card sx={{ height: 500, }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Notifications
                        </Typography>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <BatteryAlertIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Node 1: Low Battery Warning" secondary="Jan 9, 2014" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <HelpIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Node: 3: Lost Connection" secondary="Jan 7, 2014" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <NotificationImportantIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Node 2: Human Activity Detected" secondary="July 20, 2014" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <NotificationImportantIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Node 4: Vehicular Activity Detected" secondary="July 20, 2014" />
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <NotificationImportantIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary="Node 5: Earthquake Detected" secondary="July 20, 2014" />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>
            </Grid>
            <Grid xs={12} md={4}>
                <BasicCard/>
            </Grid>
            <Grid xs={12} md={4}>
                <BasicCard/>
            </Grid>
            <Grid xs={12} md={4}>
                <BasicCard/>
            </Grid>
        </Grid>
    );
}

// // Dashboard Component
// export default function Dashboard() {
//     return (
//         <Grid container spacing={2}>
//             <Grid item xs={12} md={8}>
                // <Card>
                //     <CardContent>
                        
                //     </CardContent>
                // </Card>
//             </Grid>
//             <Grid item xs={12} md={4}>
//                 <Card>
//                     <CardContent>
//                         hello
//                     </CardContent>
//                 </Card>
//             </Grid>
//             <Grid item xs={12}>
//                 <Card>
//                     hello
//                 </Card>
//             </Grid>
//         </Grid>
//     );
// }
