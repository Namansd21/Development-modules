const express = require('express');
const passport = require('passport');
const User = require('../model/User');

const router = express.Router();


// Route to render the register page
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// Route to render the login page
router.get('/login', (req, res) => {
    res.render('auth/login');
});
// Register route
router.post('/register', async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            phoneNumber: req.body.phoneNumber,
            age: req.body.age,
            monthlyIncome: req.body.monthlyIncome
        });
        await User.register(user, req.body.password);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.redirect('/register');
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/subscriptions',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', (req, res) => {
    req.logout(() => {});
    res.redirect('/login');
});



module.exports = router;
