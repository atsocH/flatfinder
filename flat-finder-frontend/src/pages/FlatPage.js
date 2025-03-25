import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Button, Box, Snackbar, Alert } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { AuthContext } from '../context/AuthContext';

const FlatPage = () => {
    const { flatId } = useParams();
    const [flat, setFlat] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [removeSuccess, setRemoveSuccess] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlat = async () => {
            try {
                const response = await fetch(`http://localhost:3002/api/flats/${flatId}`);
                const data = await response.json();
                setFlat(data);
            } catch (error) {
                console.error('Error fetching flat:', error);
            }
        };

        fetchFlat();
    }, [flatId]);

    useEffect(() => {
        const checkIfFavorite = () => {
            if (user && user.favouriteFlats && flat) {
                console.log('Checking if favorite:', user.favouriteFlats, flatId);
                if (user.favouriteFlats.some(favFlat => favFlat._id === flatId)) {
                    setIsFavorite(true);
                } else {
                    setIsFavorite(false);
                }
            }
        };

        checkIfFavorite();
    }, [user, flat, flatId]);

    const handleAddFavorite = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3002/api/users/favorites/${flatId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }
            setIsFavorite(true);
            setSuccess(true);
        } catch (error) {
            console.error('Error adding flat to favorites:', error);
            setError('An error occurred while adding the flat to favorites.');
        }
    };

    const handleRemoveFromFavorites = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3002/api/users/favorites/${flatId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }
            setIsFavorite(false);
            setRemoveSuccess(true);
        } catch (error) {
            console.error('Error removing flat from favorites:', error);
            setError('An error occurred while removing the flat from favorites.');
        }
    };

    const handleSendMessage = () => {
        navigate(`/inbox/${flat.ownerId}`);
    };

    if (!flat) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Card sx={{ padding: 2 }}>
                <Carousel showThumbs={false} dynamicHeight={false} emulateTouch>
                    {flat.photos.map((photo, index) => (
                        <div key={index}>
                            <img src={photo} alt="" style={{ borderRadius: '8px', width: '100%', height: 'auto', objectFit: 'cover' }} />
                        </div>
                    ))}
                </Carousel>
                <CardContent>
                    <Typography gutterBottom variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                        {flat.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                        {flat.description}
                    </Typography>
                    <Typography variant="h6" color="text.primary" sx={{ marginBottom: 2 }}>
                        {flat.listingType === 'sell' ? `${flat.sellPrice} €` : `${flat.rentPrice} €/month`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                        {`${flat.streetName}, ${flat.streetNumber}, ${flat.city}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                        Area Size: {flat.areaSize} sqm
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                        Year Built: {flat.yearBuilt}
                    </Typography>
                    {flat.listingType === 'rent' && (
                        <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                            Date Available: {new Date(flat.dateAvailable).toLocaleDateString()}
                        </Typography>
                    )}
                    {user && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                            {isFavorite ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleRemoveFromFavorites}
                                    sx={{ marginRight: 2 }}
                                >
                                    Remove from Favorites
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddFavorite}
                                    sx={{ marginRight: 2 }}
                                >
                                    Add to Favorites
                                </Button>
                            )}
                            <Button variant="contained" color="secondary" onClick={handleSendMessage}>
                                Send a Message to the Owner
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Flat added to favorites!
                </Alert>
            </Snackbar>
            <Snackbar open={removeSuccess} autoHideDuration={6000} onClose={() => setRemoveSuccess(false)}>
                <Alert onClose={() => setRemoveSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Flat removed from favorites!
                </Alert>
            </Snackbar>
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default FlatPage;