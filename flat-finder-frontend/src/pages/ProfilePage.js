import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Paper, Box, Divider, Avatar, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const [favoriteFlats, setFavoriteFlats] = useState([]);
    const [registeredFlats, setFlats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [replyDialogOpen, setReplyDialogOpen] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [editFormData, setEditFormData] = useState({
        firstName: '',
        lastName: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setEditFormData({
                firstName: user.firstName,
                lastName: user.lastName
            });

            const fetchFavoriteFlats = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`http://localhost:3002/api/users/${user._id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch favorite flats');
                    }
                    const data = await response.json();
                    setFavoriteFlats(data.favouriteFlats || []);
                } catch (error) {
                    console.error('Error fetching favorite flats:', error);
                    setError('Error fetching favorite flats');
                }
            };

            const fetchUserFlats = async () => {
                const token = localStorage.getItem('token');
                if (token) {
                    try {
                        const response = await fetch('http://localhost:3002/api/users/myFlats', {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        if (!response.ok) {
                            throw new Error('Failed to fetch user flats');
                        }
                        const data = await response.json();
                        setFlats(data.data.flats);
                    } catch (error) {
                        console.error('Error fetching user flats:', error);
                        setError('An error occurred while fetching your flats.');
                    }
                }
            };

            const fetchMessages = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`http://localhost:3002/api/messages/user/${user._id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch messages');
                    }
                    const data = await response.json();
                    setMessages(data || []);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                    setError('Error fetching messages');
                }
            };

            fetchFavoriteFlats();
            fetchUserFlats();
            fetchMessages();
        }
    }, [user]);

    const handleCardClick = (flatId) => {
        navigate(`/flat/${flatId}`);
    };

    const handleEditDialogOpen = () => {
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3002/api/users/${user._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editFormData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }
            const updatedUser = await response.json();
            setUser(updatedUser);
            handleEditDialogClose();
            setError('Please log out to check the changes.');
        } catch (error) {
            console.error('Error updating user:', error);
            setError('Please log out to check the changes.');
        }
    };

    const handleReplyDialogOpen = (message) => {
        setSelectedMessage(message);
        setReplyDialogOpen(true);
    };

    const handleReplyDialogClose = () => {
        setReplyDialogOpen(false);
        setReplyMessage('');
    };

    const handleReplyMessageChange = (e) => {
        setReplyMessage(e.target.value);
    };

    const handleReplyMessageSend = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3002/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ senderId: user._id, receiverId: selectedMessage.sender._id, content: replyMessage })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }
            alert('Reply sent successfully!');
            handleReplyDialogClose();
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('An error occurred while sending the reply.');
        }
    };

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Box display="flex" alignItems="center" mb={4}>
                    <Avatar src={user.profilePicture} sx={{ width: 56, height: 56, marginRight: 2 }} />
                    <Box>
                        <Typography variant="h4">{user.firstName} {user.lastName}</Typography>
                        <Typography variant="body1" color="textSecondary">{user.email}</Typography>
                        <Button variant="outlined" color="primary" onClick={handleEditDialogOpen} sx={{ marginTop: 2 }}>
                            Edit Profile
                        </Button>
                    </Box>
                </Box>
                {error && <Typography color="error">{error}</Typography>}
                <Divider sx={{ marginBottom: 4 }} />
                <Typography variant="h5" gutterBottom>Favorite Flats</Typography>
                <Grid container spacing={3}>
                    {favoriteFlats.map(flat => (
                        <Grid item xs={12} sm={6} md={4} key={flat._id}>
                            <Card sx={{ cursor: 'pointer', height: '100%' }} onClick={() => handleCardClick(flat._id)}>
                                {flat.photos && flat.photos.length > 0 && (
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
                                        {flat.listingType === 'sell' ? `${flat.sellPrice} €` : `${flat.rentPrice ? flat.rentPrice + ' €/month' : 'N/A'}`}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {`${flat.streetName}, ${flat.streetNumber}, ${flat.city}`}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Divider sx={{ marginY: 4 }} />
                <Typography variant="h5" gutterBottom>Registered Flats</Typography>
                <Grid container spacing={3}>
                    {registeredFlats.map(flat => (
                        <Grid item xs={12} sm={6} md={4} key={flat._id}>
                            <Card sx={{ cursor: 'pointer', height: '100%' }} onClick={() => handleCardClick(flat._id)}>
                                {flat.photos && flat.photos.length > 0 && (
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
                <Divider sx={{ marginY: 4 }} />
                <Typography variant="h5" gutterBottom>Messages</Typography>
                <Grid container spacing={3}>
                    {messages.map(message => (
                        <Grid item xs={12} key={message._id}>
                            <Paper sx={{ padding: 2 }}>
                                <Typography variant="body1" gutterBottom>
                                    From: {message.sender.firstName} {message.sender.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {message.content}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(message.timestamp).toLocaleString()}
                                </Typography>
                                <Button variant="outlined" color="primary" onClick={() => handleReplyDialogOpen(message)} sx={{ marginTop: 2 }}>
                                    Reply
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleEditFormSubmit}>
                        <TextField
                            label="First Name"
                            name="firstName"
                            type="text"
                            value={editFormData.firstName}
                            onChange={handleEditFormChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            type="text"
                            value={editFormData.lastName}
                            onChange={handleEditFormChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <DialogActions>
                            <Button onClick={handleEditDialogClose} color="secondary">Cancel</Button>
                            <Button type="submit" color="primary">Save</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={replyDialogOpen} onClose={handleReplyDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>Reply to Message</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Reply"
                        value={replyMessage}
                        onChange={handleReplyMessageChange}
                        fullWidth
                        multiline
                        rows={6}
                        required
                    />
                    <DialogActions>
                        <Button onClick={handleReplyDialogClose} color="secondary">Cancel</Button>
                        <Button onClick={handleReplyMessageSend} color="primary">Send</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default ProfilePage;