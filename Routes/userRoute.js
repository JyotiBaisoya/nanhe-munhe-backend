
// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'User not exists Please Signup First !' });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect Password Please Check Again !' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.secretKey,
            { expiresIn: '12h' }
        );

        res.status(200).json({ token, user,message:"Logged In Successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

module.exports = userRouter;
