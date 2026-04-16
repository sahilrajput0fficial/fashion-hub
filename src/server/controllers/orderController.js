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
        orderItems: orderItems.map(item => ({ ...item, status: 'Active' })),
        user: req.user ? req.user._id : null,
        guestInfo: req.user ? null : guestInfo,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice: totalPrice - discountPrice,
        promoCode,
        discountPrice,
        discountPercent: promoCode ? (discountPrice / itemsPrice) * 100 : 0,
        isPaid: false, // Default to false, updated via /pay route for cards
        status: paymentMethod === 'COD' ? 'Processing' : 'Pending'
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
        order.status = 'Processing';
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

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (['Shipped', 'Delivered', 'Cancelled'].includes(order.status)) {
            res.status(400);
            throw new Error(`Cannot cancel order that is already ${order.status.toLowerCase()}`);
        }

        order.status = 'Cancelled';
        // Also cancel all individual items
        order.orderItems.forEach(item => {
            item.status = 'Cancelled';
        });

        const cancelledOrder = await order.save();
        res.json(cancelledOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Cancel an order item
// @route   PUT /api/orders/:id/item/:itemId/cancel
// @access  Private
const cancelOrderItem = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (['Shipped', 'Delivered', 'Cancelled'].includes(order.status)) {
            res.status(400);
            throw new Error(`Cannot cancel items from an order that is already ${order.status.toLowerCase()}`);
        }

        const item = order.orderItems.find(i => i._id.toString() === req.params.itemId);
        if (!item) {
            res.status(404);
            throw new Error('Item not found in order');
        }

        if (item.status === 'Cancelled') {
            res.status(400);
            throw new Error('Item is already cancelled');
        }

        item.status = 'Cancelled';

        // Recalculate totals
        const activeItems = order.orderItems.filter(i => i.status === 'Active');
        
        if (activeItems.length === 0) {
            order.status = 'Cancelled';
        }

        // Update prices based on active items
        const newItemsPrice = activeItems.reduce((acc, i) => acc + i.price * i.qty, 0);
        
        let newDiscount = 0;
        if (order.discountPercent > 0) {
            newDiscount = (newItemsPrice * order.discountPercent) / 100;
        }

        order.itemsPrice = newItemsPrice;
        order.discountPrice = newDiscount;
        // Keep tax and shipping same for simplicity, or could recalculate if they depend on total
        order.totalPrice = newItemsPrice + order.taxPrice + order.shippingPrice - newDiscount;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    applyPromoCode,
    cancelOrder,
    cancelOrderItem
};
