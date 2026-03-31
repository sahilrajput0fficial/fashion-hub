const PromoCode = require('../models/PromoCode');

// @desc    Get all promo codes
// @route   GET /api/promo-codes
// @access  Private/Admin
const getPromoCodes = async (req, res) => {
    try {
        const promos = await PromoCode.find({}).sort({ createdAt: -1 });
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching promo codes' });
    }
};

// @desc    Create a promo code
// @route   POST /api/promo-codes
// @access  Private/Admin
const createPromoCode = async (req, res) => {
    try {
        const { code, discountPercent, expiryDate, isActive } = req.body;
        
        if (!code) {
            return res.status(400).json({ message: 'Promo code is required' });
        }

        const promoExists = await PromoCode.findOne({ code: code.toUpperCase() });
        if (promoExists) {
            res.status(400).json({ message: 'Promo code already exists' });
            return;
        }

        const promo = await PromoCode.create({
            code: code.toUpperCase(),
            discountPercent,
            expiryDate,
            isActive: isActive !== undefined ? isActive : true
        });

        if (promo) {
            res.status(201).json(promo);
        } else {
            res.status(400).json({ message: 'Invalid promo code data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error creating promo code' });
    }
};

// @desc    Update a promo code
// @route   PUT /api/promo-codes/:id
// @access  Private/Admin
const updatePromoCode = async (req, res) => {
    try {
        const promo = await PromoCode.findById(req.params.id);
        if (promo) {
            promo.code = req.body.code?.toUpperCase() || promo.code;
            promo.discountPercent = req.body.discountPercent || promo.discountPercent;
            promo.expiryDate = req.body.expiryDate || promo.expiryDate;
            promo.isActive = req.body.isActive !== undefined ? req.body.isActive : promo.isActive;
            
            const updatedPromo = await promo.save();
            res.json(updatedPromo);
        } else {
            res.status(404).json({ message: 'Promo code not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating promo code' });
    }
};

// @desc    Delete a promo code
// @route   DELETE /api/promo-codes/:id
// @access  Private/Admin
const deletePromoCode = async (req, res) => {
    try {
        const promo = await PromoCode.findById(req.params.id);
        if (promo) {
            await promo.deleteOne();
            res.json({ message: 'Promo code removed' });
        } else {
            res.status(404).json({ message: 'Promo code not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting promo code' });
    }
};

module.exports = {
    getPromoCodes,
    createPromoCode,
    updatePromoCode,
    deletePromoCode
};
