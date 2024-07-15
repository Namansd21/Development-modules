const express = require('express');
const router = express.Router();
const Subscription = require('../model/Subscription');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Inside your route handler for rendering the dashboard
router.get('/subscriptions', ensureAuthenticated, async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ phoneNumber: req.user.phoneNumber });
        console.log(subscriptions); // Output subscriptions array to console for debugging
        res.render('dashboard', { user: req.user, subscriptions }); 
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
});



module.exports = router;
