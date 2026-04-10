const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    applyPromoCode,
    cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Using a custom middleware wrapper to handle guest access for some routes
const optionalProtect = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return protect(req, res, next);
    }
    next();
};

router.route('/').post(optionalProtect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/promo').post(applyPromoCode);
router.route('/:id').get(optionalProtect, getOrderById);
router.route('/:id/pay').put(optionalProtect, updateOrderToPaid);
router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;
