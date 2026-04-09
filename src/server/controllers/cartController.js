const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getUserCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Cart empty' });
    }
};

// @desc    Add item to cart or update
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { productId, qty, name, image, price, size } = req.body;
    const itemSize = size || 'M';
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        const itemExists = cart.cartItems.find(x => x.product.toString() === productId && x.size === itemSize);
        if (itemExists) {
            itemExists.qty = qty;
        } else {
            cart.cartItems.push({ product: productId, name, image, price, qty, size: itemSize });
        }
        await cart.save();
    } else {
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{ product: productId, name, image, price, qty, size: itemSize }]
        });
    }
    res.status(201).json(cart);
};

module.exports = {
    getUserCart,
    addToCart
};
