const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const config = require('../config/config');


const tokenMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, config.secrets.jwt);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired.' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        } else {
            return res.status(500).json({ message: 'Server error.' });
        }
    }
};

const adminMiddleware = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.isAdmin) {
            return next();
        }

        return res.status(403).json({ message: 'Access denied. Admins only.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error.' });
    }
};

const ownerOrAdminMiddleware = async (req, res, next) => {
    const userId = req.params.userId;
    const flatId = req.params.flatId;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.isAdmin) {
            return next();
        }

        if (userId && user._id.toString() === userId) {
            return next();
        }

        if (flatId) {
            const flat = await Flat.findById(flatId);
            if (!flat) {
                return res.status(404).json({ message: 'Flat not found.' });
            }
            if (flat.ownerId.toString() === user._id.toString()) {
                return next();
            }
        }

        return res.status(403).json({ message: 'Access denied. Owners or admins only.' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = {
    tokenMiddleware,
    adminMiddleware,
    ownerOrAdminMiddleware
};