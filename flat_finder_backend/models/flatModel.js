const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    streetName: {
        type: String,
        required: [true, 'Street name is required'],
        trim: true
    },
    streetNumber: {
        type: String,
        required: [true, 'Street number is required'],
        trim: true
    },
    areaSize: {
        type: Number,
        required: [true, 'Area size is required'],
        min: [1, 'Area size must be at least 1 square meter']
    },
    yearBuilt: {
        type: Number,
        required: [true, 'Year built is required'],
        min: [1800, 'Year built must be after 1800']
    },
    listingType: {
        type: String,
        enum: ['sell', 'rent'],
        required: [true, 'Listing type is required']
    },
    sellPrice: {
        type: Number,
        required: function() { return this.listingType === 'sell'; },
        min: [0, 'Sell price must be a positive number']
    },
    rentPrice: {
        type: Number,
        required: function() { return this.listingType === 'rent'; },
        min: [0, 'Rent price must be a positive number']
    },
    dateAvailable: {
        type: Date,
        required: function() { return this.listingType === 'rent'; }
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner ID is required']
    },
    photos: {
        type: [String],
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

flatSchema.pre('save', function(next) {
    this.updated = Date.now();
    next();
});

module.exports = mongoose.model('Flat', flatSchema);
