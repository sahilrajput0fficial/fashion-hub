const express = require('express');
const router = express.Router();
const { getUserCart, addToCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserCart);
router.post('/', protect, addToCart);

module.exports = router;
