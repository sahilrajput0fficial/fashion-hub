const Subscriber = require('../models/Subscriber');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeToNewsletter = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error('Please provide an email address');
    }

    const subscriberExists = await Subscriber.findOne({ email });

    if (subscriberExists) {
        res.status(400);
        throw new Error('Email already subscribed');
    }

    const subscriber = await Subscriber.create({ email });

    if (subscriber) {
        res.status(201).json({
            message: 'Successfully subscribed to the newsletter'
        });
    } else {
        res.status(400);
        throw new Error('Invalid subscriber data');
    }
};

module.exports = {
    subscribeToNewsletter
};
