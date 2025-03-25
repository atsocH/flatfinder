import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, MenuItem, Snackbar, Alert, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { storage } from '../config/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddFlatPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        city: '',
        streetName: '',
        streetNumber: '',
        areaSize: '',
        yearBuilt: '',
        listingType: '',
        sellPrice: '',
        rentPrice: '',
        dateAvailable: '',
        description: '',
        photos: []
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleDrop = (acceptedFiles) => {
        if (acceptedFiles.length > 10) {
            setError('You can upload up to 10 photos only.');
            return;
        }
        setFormData({ ...formData, photos: acceptedFiles });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3002/api/users/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    alert('Session expired. Please log in again.');
                    navigate('/login');
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }
            const userData = await response.json();
            const ownerId = userData._id;

            const photoUrls = await Promise.all(
                formData.photos.map(async (photo) => {
                    const photoRef = ref(storage, `flats/${Date.now()}-${photo.name}`);
                    await uploadBytes(photoRef, photo);
                    return await getDownloadURL(photoRef);
                })
            );

            const flatResponse = await fetch('http://localhost:3002/api/flats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, ownerId, photos: photoUrls }) // Include ownerId in the form data
            });
            if (!flatResponse.ok) {
                const errorData = await flatResponse.json();
                throw new Error(errorData.message || 'An error occurred');
            }
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
        } catch (error) {
            setError(error.message);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: 'image/*',
        maxFiles: 10
    });

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h4" gutterBottom>Add Flat</Typography>
                {error && <Typography color="error">{error}</Typography>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="City"
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Street Name"
                                name="streetName"
                                type="text"
                                value={formData.streetName}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Street Number"
                                name="streetNumber"
                                type="text"
                                value={formData.streetNumber}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Area Size (sqm)"
                                name="areaSize"
                                type="number"
                                value={formData.areaSize}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Year Built"
                                name="yearBuilt"
                                type="number"
                                value={formData.yearBuilt}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Listing Type"
                                name="listingType"
                                select
                                value={formData.listingType}
                                onChange={handleChange}
                                fullWidth
                                required
                            >
                                <MenuItem value="sell">Sell</MenuItem>
                                <MenuItem value="rent">Rent</MenuItem>
                            </TextField>
                        </Grid>
                        {formData.listingType === 'sell' && (
                            <Grid item xs={12}>
                                <TextField
                                    label="Sell Price (EUR)"
                                    name="sellPrice"
                                    type="number"
                                    value={formData.sellPrice}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        )}
                        {formData.listingType === 'rent' && (
                            <>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Rent Price (EUR)"
                                        name="rentPrice"
                                        type="number"
                                        value={formData.rentPrice}
                                        onChange={handleChange}
                                        fullWidth
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Date Available"
                                        name="dateAvailable"
                                        type="date"
                                        value={formData.dateAvailable}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        required
                                    />
                                </Grid>
                            </>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                name="description"
                                type="text"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <div {...getRootProps()} style={{ border: '1px dashed gray', padding: '20px', textAlign: 'center' }}>
                                <input {...getInputProps()} />
                                <Typography>Click and select or drop your files here</Typography>
                            </div>
                            <div>
                                {formData.photos.map((file, index) => (
                                    <Typography key={index}>{file.name}</Typography>
                                ))}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>Add Flat</Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Flat created successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddFlatPage;