
// React
import React, { useRef } from 'react';
import { useCallback, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import { MapProvider } from "react-map-gl";
import { Layer, Map, Popup, Marker, Source, useMap } from "react-map-gl";
import { NavigationControl, GeolocateControl } from "react-map-gl";
import { Link } from 'react-router-dom';
import "maplibre-gl/dist/maplibre-gl.css";

// Material UI
import { useTheme, styled } from "@mui/material/styles";
import Box from '@mui/material/Box';
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
import DeviceHubIcon from '@mui/icons-material/DeviceHub';

// Local
import { DataStoreContext } from '../dataStore';



// Helper function to calculate the initial view state
const calculateInitialViewState = (nodes, width, height) => {
    const latitudes = nodes.map(node => node.latitude);
    const longitudes = nodes.map(node => node.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const center = [(minLng + maxLng) / 2, (minLat + maxLat) / 2];

    const deltaX = maxLng - minLng;
    const deltaY = maxLat - minLat;

    const zoomX = Math.log2((width * 360) / (deltaX * 256));
    const zoomY = Math.log2((height * 360) / (deltaY * 256));

    const zoom = Math.min(zoomX, zoomY, 15) - 2;

    return {
        latitude: center[1],
        longitude: center[0],
        zoom: zoom
    };
}; 

// Helper function to convert DMS to Decimal
const dmsToDecimal = (deg, min, sec, cp) => {
    let decimal = deg + (min / 60) + (sec / 3600);
    if (cp === 'S' || cp === 'W') {
        decimal *= -1;
    }
    return decimal;
};

// Helper function to convert log events to nodes
const logEventsToNodes = (logEvents) => {

    // Create a map of the latest node data
    const latestNodes = {};

    // Loop through the log events and update the latest node data
    logEvents.forEach((event) => {

        // Calculate the latitude and longitude
        const latitude = dmsToDecimal(event.latDeg, event.latMin, event.latSec, event.latCP);
        const longitude = dmsToDecimal(event.lonDeg, event.lonMin, event.lonSec, event.lonCP);

        // Update the latest node data
        latestNodes[event.nodeId] = {
            id: event.nodeId,
            latitude: latitude,
            longitude: longitude,
            label: `Device ${event.nodeId}`,
            detectionType: event.detectionType,
        };
    });

    // Return the latest node data
    return Object.values(latestNodes);
};

// Simple Card Component to show large number in center and subtitle below
function SimpleCard({ number, subtitle, link, ...props }) {

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <Typography component="p" variant="h3">
                    {number}
                </Typography>
                <Typography variant="h6" color="text.secondary" component={Link} to={link} sx={{ mt: 1 }}>
                    {subtitle}
                </Typography>
                {/* <Box sx={{mt: 2}}>
                    <Link color="primary" href="#" onClick={preventDefault}>
                        View balance
                    </Link>
                </Box> */}
            </CardContent>
        </Card>
    );
}

// Custom Marker Component
const CustomMarker = ({ onClick, label }) => {
    const [keyframesName, setKeyframesName] = useState(null);

    useEffect(() => {
        const pulsingKeyframes = `
        @keyframes pulsing {
          0% {
            box-shadow: 0 0 0 0 rgba(63, 81, 181, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(63, 81, 181, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(63, 81, 181, 0);
          }
        }
      `;

        const styleEl = document.createElement("style");
        document.head.appendChild(styleEl);

        styleEl.sheet.insertRule(pulsingKeyframes, 0);

        setKeyframesName("pulsing");

        return () => {
            document.head.removeChild(styleEl);
        };
    }, []);

    return (
        <Box
            sx={{
                position: 'relative',
                cursor: 'pointer',
            }}
            onClick={onClick}
        >
            <Box sx={{
                backgroundColor: "#3f51b5",
                borderRadius: "50%",
                width: "25px",
                height: "25px",
                boxShadow: "0 0 2px #3f51b5",
                zIndex: 2,
            }} />
            <Box sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "transparent",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                boxShadow: "0 0 5px #3f51b5",
                zIndex: 1,
                animation: `${keyframesName} 1.5s infinite`,
            }} />
        </Box>
    );
};

// Dashboard Map
export default function Dashboard() {

    const mapRef = useRef(null);

    // Data Store
    const { logEvents, setLogEvents } = React.useContext(DataStoreContext);
    const { deviceList, setDeviceList } = React.useContext(DataStoreContext);

    // Local States
    const [selectedNode, setSelectedNode] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    // Local Variables
    const nodes = logEventsToNodes(logEvents);    
    const initialViewState = calculateInitialViewState(nodes, 800, 500); // Replace 800 and 500 with your map's width and height.

    // console.log("initialViewState: ", initialViewState);

    const flyToNode = (latitude, longitude, zoom) => {
        if (isMapLoaded) {
            const map = mapRef.current?.getMap();
    
            if (map) {
                map.flyTo({
                    center: [longitude, latitude],
                    zoom: zoom,
                    essential: true,
                    speed: 0.8,
                    curve: 1.42,
                });
            }
        } else {
            console.log("Map not loaded");
        }
    };
    
    return (
        <Grid container spacing={4} alignItems="stretch" >

            {/* Map */}
            <Grid xs={12} md={8}>
                <Card sx={{ height: 500, }}>
                    <MapProvider>
                        <>
                            <Map
                                ref={mapRef}
                                mapStyle="https://raw.githubusercontent.com/hc-oss/maplibre-gl-styles/master/styles/osm-mapnik/v8/default.json"
                                mapLib={maplibregl}
                                attributionControl={false}
                                renderWorldCopies={false}
                                maxPitch={0}
                                dragRotate={true}
                                touchZoomRotate={true}
                                onLoad={() => setIsMapLoaded(true)}
                                initialViewState={initialViewState}
                            >

                                {/* Plot the Map points */}
                                {nodes.map((node) => (
                                    <Marker key={node.id} latitude={node.latitude} longitude={node.longitude}>
                                        <Typography
                                            sx={{
                                                position: 'absolute',
                                                top: '-20px',
                                                left: '50%',
                                                transform: 'translateX(-20%)',
                                                color: 'text.secondary',
                                                fontWeight: 'bold',
                                                fontSize: '0.90rem',
                                                width: '150px',
                                            }}>
                                            {node.label}
                                        </Typography>
                                        <CustomMarker onClick={(e) => { e.preventDefault(); setSelectedNode(node); }} />
                                    </Marker>
                                ))}

                                {selectedNode && (
                                    <Popup
                                        latitude={selectedNode.latitude}
                                        longitude={selectedNode.longitude}
                                        onClose={() => {
                                            setSelectedNode(null);
                                        }}
                                        closeOnClick={false}
                                        offsetTop={-15}
                                        anchor="top"
                                    >
                                        <div>{selectedNode.label}</div>
                                    </Popup>
                                )}

                                <NavigationControl
                                    showCompass={true} // Set to true if you want to show the compass
                                    position="top-right" // Set the position of the control on the map
                                />

                                <GeolocateControl
                                    position="top-right" // Set the position of the control on the map
                                    fitBoundsOptions={{ maxZoom: 15 }} // Set the maximum zoom level when the map is centered on the user's location
                                    trackUserLocation // Enable tracking of the user's location
                                    auto
                                />
                            </Map>
                        </>
                    </MapProvider>
                </Card>
            </Grid>

            {/* Device List */}
            <Grid xs={12} md={4}>
                <Card sx={{ height: 500, }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="text.primary" gutterBottom>
                                Device List
                            </Typography>
                            <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={() => {
                                    flyToNode(initialViewState.latitude, initialViewState.longitude, initialViewState.zoom);
                                }}
                            >
                                Reset View
                            </Button>
                        </Box>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {nodes.map((node) => (
                                <ListItem
                                    key={node.id}
                                    button
                                    onClick={() => {
                                        setSelectedNode(node);
                                        flyToNode(node.latitude, node.longitude, 15);
                                    }}                                
                                >
                                    <ListItemAvatar><Avatar><DeviceHubIcon/></Avatar></ListItemAvatar>
                                    <ListItemText primary={`Device ${node.id}`} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>

            {/* Device Status */}
            <Grid xs={12} md={4}>
                <SimpleCard number={deviceList.length} subtitle={"Connected Devices"} link="/devices" />
            </Grid>
            <Grid xs={12} md={4}>
                <SimpleCard number={nodes.length} subtitle={"Discovered Devices"} link="/notification" />
            </Grid>
            <Grid xs={12} md={4}>
                <SimpleCard number={logEvents.length} subtitle={"Detection Events"} link="/notification" />
            </Grid>
        </Grid>
    );
}
