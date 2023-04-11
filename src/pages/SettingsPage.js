// React
import React from 'react';

// Material UI
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


// Settings Page Component
export default function Settings() {
    return (
        <Box sx={{}}>
            <Typography variant="h5" sx={{p: 2}}>Settings</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="User" />
                        <CardContent>
                            <TextField
                                fullWidth
                                label="First Name"
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                autoComplete="email"
                                variant="outlined"
                            />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="Network" />
                        <CardContent>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                variant="outlined"
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button variant="contained" color="primary">
                    Save
                </Button>
            </Box>
        </Box>
    );
}
