import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function DeviceCard({ device, onConnect, ...props }) {
    return (
        <Card {...props}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {device.name}
                </Typography>
                {/* Add more details if needed */}
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" onClick={() => onConnect(device)}>
                    Connect
                </Button>
            </CardActions>
        </Card>
    );
};
