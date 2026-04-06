const User = require('../models/User');
const connectDB = require('../config/db');

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:id
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });
        await connectDB();
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const productId = req.params.id;
        const alreadyIn = user.wishlist.some(id => String(id) === String(productId));

        if (!alreadyIn) {
            user.wishlist.push(productId);
            await user.save();
            res.status(200).json({ message: 'Added to wishlist' });
        } else {
            res.status(400).json({ message: 'Product already in wishlist' });
        }
    } catch (error) {
        console.error('addToWishlist error:', error.stack || error);
        res.status(500).json({ message: 'Server Error', detail: error.message });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });
        await connectDB();
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.wishlist = user.wishlist.filter(id => String(id) !== String(req.params.id));
        await user.save();
        res.status(200).json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('removeFromWishlist error:', error.stack || error);
        res.status(500).json({ message: 'Server Error', detail: error.message });
    }
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Not authorized' });
        await connectDB();
        const user = await User.findById(req.user._id).populate('wishlist');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.wishlist || []);
    } catch (error) {
        console.error('getWishlist error:', error.stack || error);
        res.status(500).json({ message: 'Server Error', detail: error.message });
    }
};

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getWishlist
};
