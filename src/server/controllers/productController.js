const Product = require('../models/Product');
const { sendBackInStockAlert } = require('../utils/emailService');
const connectDB = require('../config/db');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        await connectDB();
        
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        let query = { ...keyword };

        // Handle multi-select filters (comma-separated strings)
        const multiFilters = ['category', 'gender', 'season', 'brand', 'material', 'fit', 'occasion', 'style', 'sustainability'];
        multiFilters.forEach(filter => {
            if (req.query[filter]) {
                const values = req.query[filter].split(',');
                query[filter] = { $in: values };
            }
        });

        // Specific array fields
        if (req.query.size) {
            query.sizes = { $in: req.query.size.split(',') };
        }
        if (req.query.color) {
            query.colors = { $in: req.query.color.split(',') };
        }

        // Price range
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // Boolean filters
        if (req.query.isSale === 'true') {
            query.isSale = true;
        }
        if (req.query.inStock === 'true') {
            query.stock = { $gt: 0 };
        }
        if (req.query.trending === 'true') {
            query.trending = true;
        }

        let sort = { _id: 1 };
        if (req.query.sort === 'price-asc') sort = { price: 1, _id: 1 };
        else if (req.query.sort === 'price-desc') sort = { price: -1, _id: 1 };
        else if (req.query.sort === 'newest') sort = { createdAt: -1, _id: 1 };
        else if (req.query.sort === 'popular') sort = { rating: -1, _id: 1 };

        const count = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort(sort)
            .limit(limit)
            .skip(skip);

        res.json({
            products,
            page,
            pages: Math.ceil(count / limit),
            total: count
        });
    } catch (error) {
        console.error('getProducts error:', error.message);
        res.status(500).json({ message: 'Server Error', detail: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        await connectDB();
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('getProductById error:', error.message);
        res.status(500).json({ message: 'Server Error', detail: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        category: 'Sample Category',
        stock: 0,
        description: 'Sample description'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { name, price, description, image, category, stock, trending } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const wasOutOfStock = product.stock === 0;

        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.category = category || product.category;
        product.stock = stock !== undefined ? stock : product.stock;
        product.trending = trending !== undefined ? trending : product.trending;

        const updatedProduct = await product.save();

        if (wasOutOfStock && updatedProduct.stock > 0 && product.subscribers && product.subscribers.length > 0) {
            for (const email of product.subscribers) {
                await sendBackInStockAlert(updatedProduct, email);
            }
            product.subscribers = [];
            await product.save();
        }

        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400).json({ message: 'Product already reviewed' });
            return;
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    subscribeToBackInStock
};

// @desc    Subscribe to back-in-stock notifications
// @route   POST /api/products/:id/subscribe
// @access  Public
async function subscribeToBackInStock(req, res) {
    const { email } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        if (!product.subscribers.includes(email)) {
            product.subscribers.push(email);
            await product.save();
        }
        res.json({ message: 'Subscribed successfully' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
}
