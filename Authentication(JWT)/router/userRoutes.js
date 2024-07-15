const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userfound = await User.findOne({ email })
        console.log(userfound);
        if (userfound != null) {
            res.status(422).json({ message: "email already exist" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        // console.log(name, email, password);
        const userData = await new User({ name, email, password:hashedPassword });
        await userData.save();
        res.status(201).json({userData})
    }
    catch (e) {
        console.log(e)
    }
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userfound = await User.findOne({ email });
        if (userfound == null) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const hashedPassword = userfound.password;
        const isMatched = await bcrypt.compare(password, hashedPassword);
        if (isMatched) {
            const token = jwt.sign({ _id: userfound._id }, "hsajgdhjsadjhkjagdssajkhkddwd", { expiresIn: '5d' });
            res.status(200).json({ msg: 'User Loggen In Successfully' ,token ,userfound});
        }
        else {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ error :e });

    }
})

router.post('/verify',async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, "hsajgdhjsadjhkjagdssajkhkddwd");
        const useData=await User.findById(user._id)
        res.status(200).json({ user,useData });
    }
    catch (e) {
        console.log(e)
        res.status(500).json({ e });

    }
})

module.exports = router;