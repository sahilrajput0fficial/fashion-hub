const Order = require('../models/Order');
const PromoCode = require('../models/PromoCode');
const { sendOrderConfirmation } = require('../utils/emailService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest or Auth)
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        guestInfo,
        promoCode
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    let discountPrice = 0;
    if (promoCode) {
        const promo = await PromoCode.findOne({ 
            code: promoCode.trim().toUpperCase(), 
            isActive: true, 
            expiryDate: { $gte: new Date() } 
        });
        if (promo) {
            discountPrice = (itemsPrice * promo.discountPercent) / 100;
        }
    }

    const order = new Order({
        orderItems,
        user: req.user ? req.user._id : null,
        guestInfo: req.user ? null : guestInfo,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice: totalPrice - discountPrice,
        promoCode,
        discountPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Guest
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        // Authorization check: If order has a user, only that user or admin can see it.
        // If it's a guest order, anyone with the ID can see it (simplified for demo).
        if (order.user && (!req.user || (req.user._id.toString() !== order.user._id.toString() && !req.user.isAdmin))) {
            res.status(401);
            throw new Error('Not authorized');
        }
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private/Guest
const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();
        await sendOrderConfirmation(updatedOrder);
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Apply Promo Code
// @route   POST /api/orders/promo
// @access  Public
const applyPromoCode = async (req, res) => {
    const { code } = req.body;
    if (!code) {
        res.status(400);
        throw new Error('Promo code is required');
    }
    const promo = await PromoCode.findOne({ 
        code: code.trim().toUpperCase(), 
        isActive: true, 
        expiryDate: { $gte: new Date() } 
    });

    if (promo) {
        res.json({
            code: promo.code,
            discountPercent: promo.discountPercent
        });
    } else {
        res.status(404);
        throw new Error('Invalid or expired promo code');
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    applyPromoCode
};
