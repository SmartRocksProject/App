// React
import React, { useRef } from 'react';
import { Protobuf } from '@smartrocksproject/meshtasticjs';
import { useSnackbar } from 'notistack';
import { fromByteArray, toByteArray } from "base64-js";

// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';

// Local
import { DataStoreContext } from '../../dataStore';
import DynamicForm from '../Form/DynamicForm';


// Update Settings Dialog Component
export default function UpdateSettingsDialog({ open, setOpen, device, ...props }) {
    const formRef = useRef();

    // Load data store
    const { activeConnection, setActiveConnection } = React.useContext(DataStoreContext);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // Get the first channel
    const firstChannel = device.channels?.size > 0 ? device.channels.entries().next().value[1] : null;

    // Get default values
    const defaultValues = {

        // Channel settings
        role: firstChannel?.role,
        settings: {
            psk: firstChannel?.settings?.psk,
            channelNum: firstChannel?.settings?.channelNum,
            name: firstChannel?.settings?.name,
            id: firstChannel?.settings?.id,
            uplinkEnabled: device.config?.settings?.uplinkEnabled,
            downlinkEnabled: device.config?.settings?.downlinkEnabled,
        },

        // Mesh settings
        region: device.config?.lora?.region,
        hopLimit: device.config?.lora?.hopLimit,
        channelNum: device.config?.lora?.channelNum,

        // Bluetooth settings
        enabled: device.config?.bluetooth?.enabled,
        mode: device.config?.bluetooth?.mode,
        fixedPin: device.config?.bluetooth?.fixedPin,
    };

    // Get field groups
    const fieldGroups = [
        {
            label: "Channel Settings",
            description: "Crypto, MQTT & misc settings",
            fields: [
                {
                    type: "select",
                    name: "role",
                    label: "Role",
                    description: "Description",
                    properties: {
                        enumValue: Protobuf.Channel_Role
                    }
                },
                {
                    type: "password",
                    name: "settings_psk",
                    label: "pre-Shared Key",
                    description: "Description",
                    properties: {
                        // act
                    }
                },
                // {
                //     type: "number",
                //     name: "settings.channelNum",
                //     label: "Channel Number",
                //     description: "Description"
                // },
                // {
                //     type: "text",
                //     name: "settings.name",
                //     label: "Name",
                //     description: "Description"
                // },
                // {
                //     type: "number",
                //     name: "settings.id",
                //     label: "ID",
                //     description: "Description"
                // },
                // {
                //     type: "toggle",
                //     name: "settings.uplinkEnabled",
                //     label: "Uplink Enabled",
                //     description: "Description"
                // },
                // {
                //     type: "toggle",
                //     name: "settings.downlinkEnabled",
                //     label: "Downlink Enabled",
                //     description: "Description"
                // }
            ]
        },
        {
            label: "Mesh Settings",
            description: "Settings for the LoRa mesh",
            fields: [
                {
                    type: "select",
                    name: "region",
                    label: "Region",
                    description: "Sets the region for your node",
                    properties: {
                        enumValue: Protobuf.Config_LoRaConfig_RegionCode
                    }
                },
                {
                    type: "number",
                    name: "hopLimit",
                    label: "Hop Limit",
                    description: "Maximum number of hops"
                },
                {
                    type: "number",
                    name: "channelNum",
                    label: "Channel Number",
                    description: "LoRa channel number"
                }
            ]
        },
        {
            label: 'Bluetooth Settings',
            description: 'Settings for the Bluetooth module',
            fields: [
                {
                    type: 'toggle',
                    name: 'enabled',
                    label: 'Enabled',
                    description: 'Enable or disable Bluetooth',
                },
                {
                    type: 'select',
                    name: 'mode',
                    label: 'Pairing mode',
                    description: 'Pin selection behavior.',
                    disabledBy: [
                        {
                            fieldName: 'enabled',
                        },
                    ],
                    properties: {
                        enumValue: Protobuf.Config_BluetoothConfig_PairingMode,
                        formatEnumName: true,
                    },
                },
                {
                    type: 'number',
                    name: 'fixedPin',
                    label: 'Pin',
                    description: 'Pin to use when pairing',
                    disabledBy: [
                        {
                            fieldName: 'mode',
                            selector: Protobuf.Config_BluetoothConfig_PairingMode.FIXED_PIN,
                            invert: true,
                        },
                        {
                            fieldName: 'enabled',
                        },
                    ],
                    properties: {},
                },
            ],
        },
    ];

    // Handle form submit
    const handleFormSubmit = async (formData) => {
        console.log('Submitting Form data:', formData);

        // Create and populate protobuf message for channel settings
        const channelSettings = new Protobuf.Channel({
            usePreset: true,
            index: 0,
            role: formData.role,
            settings: {
                // channelNum: formData.settings.channelNum,
                psk: toByteArray(formData.settings_psk ?? ""),
                // name: formData.settings.name,
                // id: formData.settings.id,
                // uplinkEnabled: formData.settings.uplinkEnabled,
                // downlinkEnabled: formData.settings.downlinkEnabled,
            },
        });

        // Create and populate protobuf message for lora config
        const loraConfig = new Protobuf.Config_LoRaConfig({
            usePreset: true, // true to use a preset, false to use custom settings
            region: formData.region,
            hopLimit: formData.hopLimit,
            channelNum: formData.channelNum,
        });

        // Create and populate protobuf message for bluetooth config
        const bluetoothConfig = new Protobuf.Config_BluetoothConfig({
            usePreset: true, // true to use a preset, false to use custom settings
            enabled: formData.enabled,
            mode: formData.mode,
            fixedPin: formData.fixedPin,
        });

        // Create and populate protobuf message for config
        const config = new Protobuf.Config();
        config.lora = loraConfig;
        config.bluetooth = bluetoothConfig;

        console.log('Device:', activeConnection);


        try {

            // Set the channel settings
            activeConnection.setChannel(channelSettings);

            // Set the LoRa config
            activeConnection.setConfig(
                new Protobuf.Config({
                    payloadVariant: {
                        case: "lora",
                        value: loraConfig
                    }
                })
            );

            // Set the Bluetooth config
            activeConnection.setConfig(
                new Protobuf.Config({
                    payloadVariant: {
                        case: "bluetooth",
                        value: bluetoothConfig
                    }
                })
            );

            // Commit config to device
            activeConnection.commitEditSettings();

            // Show snackbar
            enqueueSnackbar('Send the configuration update to device! Please refresh the page.', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center', } });

            // Close dialog
            handleClose();

        } catch (error) {
            console.log('Error sending config:', error);
            enqueueSnackbar('There was an error sending the config to the device.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center', } });
        }

    };

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.submit();
        } else {
            console.log('Form not found');
        }
    };

    // Handle close
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            fullWidth={true}
            maxWidth="md"
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Configuration Settings: {device.name} </DialogTitle>
            <DialogContent>
                {/* <DialogContentText>
                    Edit the configuration settings for the device. 
                </DialogContentText> */}

                <DynamicForm
                    ref={formRef}
                    onSubmit={handleFormSubmit}            
                    defaultValues={defaultValues}
                    fieldGroups={fieldGroups}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" onClick={handleExternalSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}
