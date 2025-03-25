import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Paper, Grid, Snackbar, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const InboxPage = () => {
    const { ownerId } = useParams();
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const { user } = useContext(AuthContext);

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3002/api/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ senderId: user._id, receiverId: ownerId, content: message })
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An error occurred');
            }
            setMessage('');
            setSuccess(true);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('An error occurred while sending the message.');
        }
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>Send Message to Owner</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            label="Message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleSendMessage} fullWidth>
                            Send Message
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    Message Sent!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default InboxPage;
