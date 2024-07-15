const express = require('express');
const router = express.Router();
const Subscription = require('../model/Subscription');



router.get('/subscriptions/new', ensureAuthenticated, (req, res) => {
    res.render('subscriptions/new');
});

router.post('/subscriptions', ensureAuthenticated, async (req, res) => {
    try {
        const subscription = new Subscription({
            plan: req.body.plan,
            cost: req.body.cost,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            phoneNumber: req.user.phoneNumber
        });

        await subscription.save();
        res.redirect('/subscriptions');
    } catch (error) {
        console.error(error);
        res.redirect('/subscriptions/new');
    }
});

router.get('/subscriptions/:id', ensureAuthenticated, async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).send('Subscription not found');
        }
        res.render('subscriptions/show', { subscription });
    } catch (error) {
        console.error(error);
        res.redirect('/subscriptions');
    }
});

router.post('/subscriptions/:id', ensureAuthenticated, async (req, res) => {

                try {
                    const { plan, cost, startDate, endDate } = req.body;
                    const subscriptionId = req.params.id;

                    // Construct the update object
                    const update = {
                        $set: {
                            plan,
                            cost,
                            startDate,
                            endDate
                        }
                    };

                    // Update the subscription using updateOne
                    await Subscription.updateOne({ _id: subscriptionId }, update);

                    // Redirect to the updated subscription's page
                    res.redirect(`/subscriptions/${subscriptionId}`);
                } catch (error) {
                    console.error(error);
                    res.redirect(`/subscriptions/${req.params.id}/edit`);
                }
            });


router.get('/subscriptions/:id/edit', ensureAuthenticated, async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            return res.status(404).send('Subscription not found');
        }
        res.render('subscriptions/edit', { subscription });
    } catch (error) {
        console.error(error);
        res.redirect('/subscriptions');
    }
});

router.post('/subscriptions/:id/delete', ensureAuthenticated, async (req, res) => {
    try {
        await Subscription.findByIdAndDelete(req.params.id);
        res.redirect('/subscriptions');
    } catch (error) {
        console.error(error);
        res.redirect(`/subscriptions/${req.params.id}`);
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;
