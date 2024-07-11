const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Login = require('../models/Login');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { f_userName, f_Pwd } = req.body;
    try {
        console.log('Registering user:', f_userName);
        const user = await Login.findOne({ f_userName });
        if (user) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(f_Pwd, 10);
        const newUser = new Login({ f_userName, f_Pwd: hashedPassword });
        await newUser.save();
        console.log('User registered successfully');
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Login
router.post('/login', async (req, res) => {
    const { f_userName, f_Pwd } = req.body;

    try {
        const user = await Login.findOne({ f_userName });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(f_Pwd, user.f_Pwd);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid login details' });
        }

        const token = jwt.sign({ id: user._id }, 'secretKey');
        res.cookie('token', token, { httpOnly: true });

        res.json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


// Logout route
router.post('/logout', authMiddleware, (req, res) => {
    // Here you can handle token invalidation, e.g., by maintaining a blacklist of invalidated tokens
    // For simplicity, we'll just send a response indicating the user is logged out
    res.status(200).send({ message: 'Logged out successfully' });
});


module.exports = router;
