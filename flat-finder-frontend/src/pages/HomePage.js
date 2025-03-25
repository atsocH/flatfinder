import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, FormControl, Card, CardContent, CardMedia, RadioGroup, FormControlLabel, Radio, Slider, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [flats, setFlats] = useState([]);
    const [filteredFlats, setFilteredFlats] = useState([]);
    const [filter, setFilter] = useState({
        type: 'Buy',
        priceRange: [0, 1000000],
        areaSize: '',
        yearBuiltRange: [1900, new Date().getFullYear()],
        search: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlats = async () => {
            try {
                const response = await fetch('http://localhost:3002/api/flats');
                const data = await response.json();
                setFlats(data);
                setFilteredFlats(data);
            } catch (error) {
                console.error('Error fetching flats:', error);
            }
        };

        fetchFlats();
    }, []);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const handlePriceRangeChange = (event, newValue) => {
        setFilter({ ...filter, priceRange: newValue });
    };

    const handleYearBuiltRangeChange = (event, newValue) => {
        setFilter({ ...filter, yearBuiltRange: newValue });
    };

    const handleSearch = () => {
        let filtered = flats;

        if (filter.type === 'Buy') {
            filtered = filtered.filter(flat => flat.listingType === 'sell');
            filtered = filtered.filter(flat => flat.sellPrice >= filter.priceRange[0] && flat.sellPrice <= filter.priceRange[1]);
        } else {
            filtered = filtered.filter(flat => flat.listingType === 'rent');
            filtered = filtered.filter(flat => flat.rentPrice >= filter.priceRange[0] && flat.rentPrice <= filter.priceRange[1]);
        }

        if (filter.search) {
            filtered = filtered.filter(flat => flat.city.toLowerCase().includes(filter.search.toLowerCase()));
        }

        if (filter.areaSize) {
            filtered = filtered.filter(flat => flat.areaSize >= filter.areaSize);
        }

        filtered = filtered.filter(flat => flat.yearBuilt >= filter.yearBuiltRange[0] && flat.yearBuilt <= filter.yearBuiltRange[1]);

        setFilteredFlats(filtered);
    };

    const handleClearFilters = () => {
        setFilter({
            type: 'Buy',
            priceRange: [0, 1000000],
            areaSize: '',
            yearBuiltRange: [1900, new Date().getFullYear()],
            search: ''
        });
        setFilteredFlats(flats);
    };

    const handleCardClick = (flatId) => {
        navigate(`/flat/${flatId}`);
    };

    return (
        <Container>
            <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
                <Paper elevation={3} sx={{ padding: 3, display: 'inline-block', borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <FormControl component="fieldset">
                                <RadioGroup row name="type" value={filter.type} onChange={handleFilterChange}>
                                    <FormControlLabel value="Buy" control={<Radio />} label="Buy" />
                                    <FormControlLabel value="Rent" control={<Radio />} label="Rent" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs>
                            <Typography gutterBottom>Price Range (€)</Typography>
                            <Slider
                                value={filter.priceRange}
                                onChange={handlePriceRangeChange}
                                valueLabelDisplay="auto"
                                min={0}
                                max={1000000}
                                step={1}
                                sx={{ minWidth: 300 }}
                            />
                        </Grid>
                        <Grid item xs>
                            <Typography gutterBottom>Year Built Range</Typography>
                            <Slider
                                value={filter.yearBuiltRange}
                                onChange={handleYearBuiltRangeChange}
                                valueLabelDisplay="auto"
                                min={1900}
                                max={new Date().getFullYear()}
                                step={1}
                                sx={{ minWidth: 300 }}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                name="areaSize"
                                label="Min Area Size (m²)"
                                value={filter.areaSize}
                                onChange={handleFilterChange}
                                fullWidth
                                sx={{ minWidth: 150 }}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                name="search"
                                label="Search for a city in Portugal"
                                value={filter.search}
                                onChange={handleFilterChange}
                                fullWidth
                                sx={{ minWidth: 300 }}
                            />
                        </Grid>
                        <Grid item container justifyContent="flex-end" spacing={2}>
                            <Grid item>
                                <Button variant="outlined" color="secondary" onClick={handleClearFilters}>Clear Filters</Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Typography variant="h4" gutterBottom>Available Flats</Typography>
            <Grid container spacing={3}>
                {filteredFlats.map(flat => (
                    <Grid item xs={12} sm={6} md={4} key={flat._id}>
                        <Card sx={{ cursor: 'pointer' }} onClick={() => handleCardClick(flat._id)}>
                            {flat.photos.length > 0 && (
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={flat.photos[0]}
                                    alt={flat.title}
                                />
                            )}
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {flat.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {flat.description}
                                </Typography>
                                <Typography variant="h6" color="text.primary">
                                    {flat.listingType === 'sell' ? `${flat.sellPrice} €` : `${flat.rentPrice} €/month`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {`${flat.streetName}, ${flat.streetNumber}, ${flat.city}`}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HomePage;