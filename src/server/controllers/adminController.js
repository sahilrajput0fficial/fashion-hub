const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    const orders = await Order.find({});
    const products = await Product.find({});
    const users = await User.find({});

    const totalSales = orders.filter(o => o.isPaid).reduce((acc, item) => acc + item.totalPrice, 0);
    const orderCount = orders.length;
    const userCount = users.length;
    const lowStockCount = products.filter(p => p.stock < 10).length;

    res.json({
        totalSales,
        orderCount,
        userCount,
        lowStockCount,
        recentOrders: orders.slice(-5).reverse()
    });
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        order.orderStatus = status;
        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }
        if (status === 'Paid') {
            order.isPaid = true;
            order.paidAt = Date.now();
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get order by ID (Admin)
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
const getAdminOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('orderItems.product');
    
    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

module.exports = {
    getDashboardStats,
    updateOrderStatus,
    getAllOrders,
    getAllUsers,
    updateUserRole,
    getAdminOrderById
};
