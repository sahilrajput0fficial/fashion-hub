const express = require('express');
const router = express.Router();
const { 
    getDashboardStats, 
    updateOrderStatus, 
    getAllOrders, 
    getAllUsers, 
    updateUserRole,
    getAdminOrderById
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.get('/orders/:id', protect, admin, getAdminOrderById);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);

module.exports = router;
