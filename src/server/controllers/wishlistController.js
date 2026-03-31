const User = require('../models/User');
const connectDB = require('../config/db');

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:id
// @access  Private
const addToWishlist = async (req, res) => {
    try {
        await connectDB();
        const user = await User.findById(req.user._id);
        if (!user.wishlist.includes(req.params.id)) {
            user.wishlist.push(req.params.id);
            await user.save();
            res.status(200).json({ message: 'Added to wishlist' });
        } else {
            res.status(400).json({ message: 'Product already in wishlist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
const removeFromWishlist = async (req, res) => {
    try {
        await connectDB();
        const user = await User.findById(req.user._id);
        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
        await user.save();
        res.status(200).json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
    try {
        await connectDB();
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getWishlist
};
