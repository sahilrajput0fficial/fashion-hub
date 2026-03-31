const mongoose = require('mongoose');

const promoCodeSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    discountPercent: {
        type: Number,
        required: true,
        default: 0
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    expiryDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

module.exports = PromoCode;
