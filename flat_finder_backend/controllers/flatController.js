const Flat = require('../models/flatModel');
const User = require('../models/userModel');

exports.getAllFlats = async (req, res) => {
    try {
        const flats = await Flat.find();
        res.status(200).json(flats);
    } catch (err) {
        console.error('Error fetching flats:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createFlat = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const { title, description, city, streetName, streetNumber, areaSize, yearBuilt, listingType, sellPrice, rentPrice, dateAvailable, photos } = req.body;

        const flat = new Flat({
            title,
            description,
            city,
            streetName,
            streetNumber,
            areaSize,
            yearBuilt,
            listingType,
            sellPrice,
            rentPrice,
            dateAvailable,
            ownerId,
            photos 
        });

        await flat.save();
        res.status(201).json(flat);
    } catch (error) {
        console.error('Error creating flat:', error);
        res.status(400).json({ message: 'Internal server error' });
    }
};

exports.getFlatById = async (req, res) => {
    try {
        const flat = await Flat.findById(req.params.flatId);
        if (!flat) {
            return res.status(404).json({ message: 'Flat not found' });
        }
        res.status(200).json(flat);
    } catch (err) {
        console.error('Error fetching flat by ID:', err);
        res.status(500).json({ message: 'Internal server error' });
    } 
};
exports.getFlatByOwnerId = async (req, res) => {
    try {
        const flats = await Flat.find({ ownerId: req.params.ownerId });
        res.status(200).json(flats);
    } catch (err) {
        console.error('Error fetching flat by owner ID:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateFlat = async (req, res) => {
    try {
        const flat = await Flat.findByIdAndUpdate(req.params.flatId, req.body, { new: true, runValidators: true });
        if (!flat) {
            return res.status(404).json({ message: 'Flat not found' });
        }
        res.status(200).json(flat);
    } catch (err) {
        console.error('Error updating flat:', err);
        res.status(400).json({ message: 'Internal server error' });
    }
};

exports.deleteFlat = async (req, res) => {
    try {
        const flat = await Flat.findByIdAndDelete(req.params.flatId);
        if (!flat) {
            return res.status(404).json({ message: 'Flat not found' });
        }
        res.status(200).json({ message: 'Flat deleted' });
    } catch (err) {
        console.error('Error deleting flat:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.addFlatToFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const flat = await Flat.findById(req.params.flatId);
        if (!flat) {
            return res.status(404).json({ message: 'Flat not found' });
        }

        if (!user.favouriteFlats.includes(flat._id)) {
            user.favouriteFlats.push(flat._id);
            await user.save();
        }

        res.status(200).json({ message: 'Flat added to favorites' });
    } catch (err) {
        console.error('Error adding flat to favorites:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
