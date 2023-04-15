
// React
import React from 'react';
import { useParams } from 'react-router-dom';

// Material UI
import Box from '@mui/material/Box';


// A page that displays the details of a device
export default function DeviceDetailsPage(props) {

    // Get the device ID from the URL
    const { id } = useParams();

    return (
        <Box>
            Device ID: {id}
        </Box>
    );
}