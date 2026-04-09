const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cartItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true, default: 1 },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            size: { type: String, default: 'M' },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            }
        }
    ]
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
