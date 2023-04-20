
// React
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet'; 

// Material UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';


const parkData = {
    "type": "FeatureCollection",
    "crs": {
        "type": "name",
        "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" }
    },
    "features": [
        {
            "type": "Feature",
            "properties": {
                "PARK_ID": 960,
                "FACILITYID": 28014,
                "NAME": "Bearbrook Skateboard Park",
                "NAME_FR": "Planchodrome Bearbrook",
                "ADDRESS": "8720 Russell Road",
                "ADDRESS_FR": "8720, chemin Russell",
                "FACILITY_T": "flat",
                "FACILITY_1": "plat",
                "ACCESSCTRL": "no/non",
                "ACCESSIBLE": "no/non",
                "OPEN": null,
                "NOTES": "Outdoor",
                "MODIFIED_D": "2018/01/18",
                "CREATED_DA": null,
                "FACILITY": "Neighbourhood : smaller size facility to service population of 10,000 or less",
                "FACILITY_F": "De voisinage : petite installation assurant des services à 10 000 résidents ou moins.",
                "DESCRIPTIO": "Flat asphalt surface, 5 components",
                "DESCRIPT_1": "Surface d'asphalte plane, 5 modules",
                "PICTURE_LI": null,
                "PICTURE_DE": null,
                "PICTURE__1": null
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-75.3372987731628, 45.383321536272049]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "PARK_ID": 1219,
                "FACILITYID": 28001,
                "NAME": "Bob MacQuarrie Skateboard Park (SK8 Extreme Park)",
                "NAME_FR": "Planchodrome Bob-MacQuarrie (Parc SK8 Extreme)",
                "ADDRESS": "1490 Youville Drive",
                "ADDRESS_FR": "1490, promenade Youville",
                "FACILITY_T": "other",
                "FACILITY_1": "autre",
                "ACCESSCTRL": "no/non",
                "ACCESSIBLE": "no/non",
                "OPEN": null,
                "NOTES": "Outdoor",
                "MODIFIED_D": "2018/01/18",
                "CREATED_DA": null,
                "FACILITY": "Community: mid size facility to service population of 40,000 plus",
                "FACILITY_F": "Communautaire : installation de taille moyenne assurant des services à 40 000 résidents ou plus.",
                "DESCRIPTIO": "Flat asphalt surface, 10 components, City run learn to skateboard programs, City run skateboard camps in summer",
                "DESCRIPT_1": "Surface d'asphalte plane, 10 modules, programmes et camps de planche à roulettes en été géré par la Ville",
                "PICTURE_LI": null,
                "PICTURE_DE": null,
                "PICTURE__1": null
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-75.546518086577947, 45.467134581917357]
            }
        },
    ]
}
  

// Map Component
export default function Map() {

    const [activePark, setActivePark] = React.useState(null);
    const icon = new Icon({
        iconUrl: "/skateboarding.svg",
        iconSize: [25, 25]
    });


    return (
        <Card sx={{ height: 500, }}>
            <CardContent sx={{ m: -2, }}>
                <MapContainer center={[45.4, -75.7]} zoom={12} scrollWheelZoom={false}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {parkData.features.map(park => (
                        <Marker
                            key={park.properties.PARK_ID}
                            position={[
                                park.geometry.coordinates[1],
                                park.geometry.coordinates[0]
                            ]}
                            onClick={() => {
                                setActivePark(park);
                            }}
                            icon={icon}
                        />
                    ))}

                    {activePark && (
                        <Popup
                            position={[
                                activePark.geometry.coordinates[1],
                                activePark.geometry.coordinates[0]
                            ]}
                            onClose={() => {
                                setActivePark(null);
                            }}
                        >
                            <div>
                                <h2>{activePark.properties.NAME}</h2>
                                <p>{activePark.properties.DESCRIPTIO}</p>
                            </div>
                        </Popup>
                    )}
                </MapContainer>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    );
}