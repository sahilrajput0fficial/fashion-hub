const express = require('express');
const router = express.Router();
const { 
    getPromoCodes, 
    createPromoCode, 
    updatePromoCode, 
    deletePromoCode 
} = require('../controllers/promoCodeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getPromoCodes)
    .post(protect, admin, createPromoCode);

router.route('/:id')
    .put(protect, admin, updatePromoCode)
    .delete(protect, admin, deletePromoCode);

module.exports = router;
