const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { isEmail } = require('validator');

const validatePassword = (password) => {
    const minLength = 8;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const sequentialNumberRegex = /(012|123|234|345|456|567|678|789|890)/;

    if (password.length < minLength) {
        throw new Error('Password must be at least 8 characters long');
    }
    if (!specialCharRegex.test(password)) {
        throw new Error('Password must contain at least one special character');
    }
    if (sequentialNumberRegex.test(password)) {
        throw new Error('Password cannot contain sequential numbers');
    }
    return true;
};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: [validatePassword, 'Password validation failed']
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    favouriteFlats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat'
    }],
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.pre('save', function(next) {
    this.updated = Date.now();
    next();
});

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;