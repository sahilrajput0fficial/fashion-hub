const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Unisex'],
        default: 'Unisex'
    },
    season: {
        type: String,
        required: true,
        enum: ['Winter', 'Summer', 'All-Season'],
        default: 'All-Season'
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    trending: {
        type: Boolean,
        default: false
    },
    sizes: {
        type: [String],
        default: ['XS', 'S', 'M', 'L', 'XL']
    },
    colors: {
        type: [String],
        default: ['Standard']
    },
    reviews: [{
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    subscribers: [
        { type: String }
    ],
    brand: {
        type: String,
        trim: true
    },
    material: {
        type: String,
        trim: true
    },
    fit: {
        type: String,
        trim: true
    },
    occasion: {
        type: String,
        trim: true
    },
    style: {
        type: String,
        trim: true
    },
    sustainability: {
        type: [String],
        default: []
    },
    isSale: {
        type: Boolean,
        default: false
    },
    discountPercent: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
