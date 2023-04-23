
// React
import React, { forwardRef, useImperativeHandle } from 'react';

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
import Typography from '@mui/material/Typography';
import FormHelperText from '@mui/material/FormHelperText';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';


// Function to get the disabled state of a field
function getFieldDisabledState(fields, fieldName, disabledBy) {
    const field = fields.find((field) => field.name === fieldName);

    if (field) {
        if (disabledBy.fieldName) {
            return getFieldDisabledState(
                fields,
                disabledBy.fieldName,
                disabledBy.selector
            );
        } else if (disabledBy.invert) {
            return !field.value;
        } else {
            return field.value === disabledBy.selector;
        }
    }

    return false;
}

// Dynamic Form Component
const DynamicForm = forwardRef(({ onSubmit, defaultValues, fieldGroups }, ref) => {
    const [fields, setFields] = React.useState(
        fieldGroups
            .map((group) => group.fields)
            .flat()
            .map((field) => ({
                ...field,
                value: defaultValues[field.name],
            }))
    );

    const handleFieldChange = (name, value) => {
        setFields((prevState) =>
            prevState.map((field) => {
                const nameParts = name.split('.');
                if (nameParts.length === 1 && field.name === name) {
                    // Normal case for non-nested properties
                    return { ...field, value };
                } else if (nameParts.length === 2 && field.name === nameParts[0]) {
                    // Case for nested properties
                    return {
                        ...field,
                        value: {
                            ...field.value,
                            [nameParts[1]]: value,
                        },
                    };
                }
                return field;
            })
        );
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const formData = fields.reduce((acc, field) => {
            const nameParts = field.name.split('.');
            if (nameParts.length === 1) {
                acc[field.name] = field.value;
            } else if (nameParts.length === 2) {
                if (!acc[nameParts[0]]) {
                    acc[nameParts[0]] = {};
                }
                acc[nameParts[0]][nameParts[1]] = field.value;
            }
            return acc;
        }, {});
        onSubmit(formData);
    };

    useImperativeHandle(ref, () => ({
        submit: handleSubmit,
    }));

    return (
        <form onSubmit={handleSubmit}>
            {fieldGroups.map((group, groupIndex) => (
                <FormGroup key={groupIndex} sx={{ p: 1 }}>
                    <FormLabel component="legend">{group.label}</FormLabel>
                    <FormHelperText>{group.description}</FormHelperText>
                    <Box>
                        {group.fields.map((field, fieldIndex) => {
                            const isDisabled = field.disabledBy
                                ? getFieldDisabledState(fields, field.name, field.disabledBy)
                                : false;

                            switch (field.type) {
                                case 'toggle':
                                    return (
                                        <Box key={fieldIndex} sx={{ p: 1 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={fields.find((f) => f.name === field.name).value}
                                                        onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                                                        disabled={isDisabled}
                                                    />
                                                }
                                                label={field.label}
                                            />
                                        </Box>
                                    );

                                case 'select':
                                    return (
                                        <Box key={fieldIndex} sx={{ p: 1 }}>
                                            <FormControl fullWidth disabled={isDisabled}>
                                                <InputLabel>{field.label}</InputLabel>
                                                <Select
                                                    value={fields.find((f) => f.name === field.name).value}
                                                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                >
                                                    {Object.entries(field.properties.enumValue).map(([key, value]) => (
                                                        <MenuItem key={key} value={value}>
                                                            {field.properties.formatEnumName
                                                                ? key.replace(/_/g, ' ')
                                                                : key}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                <FormHelperText>{field.description}</FormHelperText>
                                            </FormControl>
                                        </Box>
                                    );

                                case 'number':
                                    return (
                                        <Box key={fieldIndex} sx={{ p: 1 }}>
                                            <TextField
                                                type="number"
                                                label={field.label}
                                                value={fields.find((f) => f.name === field.name).value}
                                                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                                fullWidth
                                                disabled={isDisabled}
                                                helperText={field.description}
                                            />
                                        </Box>
                                    );

                                case 'password':
                                    return (
                                        <TextField
                                            key={fieldIndex}
                                            type="password"
                                            label={field.label}
                                            value={fields.find((f) => f.name === field.name).value}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            fullWidth
                                            disabled={isDisabled}
                                            helperText={field.description}
                                            sx={{ p: 1 }}
                                        />
                                    );

                                case 'text':
                                    return (
                                        <TextField
                                            key={fieldIndex}
                                            type="text"
                                            label={field.label}
                                            value={fields.find((f) => f.name === field.name).value}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            fullWidth
                                            disabled={isDisabled}
                                            helperText={field.description}
                                            sx={{ p: 1 }}
                                        />
                                    );

                                // Add other field types if needed

                                default:
                                    return null;
                            }
                        })}
                    </Box>

                </FormGroup>
            ))}
        </form>
    );
});

export default DynamicForm;
