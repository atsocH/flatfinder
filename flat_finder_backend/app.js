const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/config');
const flatRoutes = require('./routes/flatRoute');
const messageRoutes = require('./routes/messageRoute');
const userRoutes = require('./routes/userRoute');

mongoose.connect(config.getDbConnectionString())
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());
app.use('/api/flats', flatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

const port = process.env.PORT
app.listen(port, () => console.log(`Server is running on port ${port}`));