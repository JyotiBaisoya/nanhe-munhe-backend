// routes/cart.js
const express = require('express');
const Cart = require('../models/cart');
const authenticateToken = require('../middleware/authenticator');

const cartRouter = express.Router();

// GET: Fetch user's cart (protected route)
cartRouter.get('/cart', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from decoded token
        const cart = await Cart.findOne({ user: userId }).populate('products');
        res.json({cart,message:"Your Cart Items"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

cartRouter.post('/cart/add/:productId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const productId = req.params.productId;

        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            // If cart doesn't exist, create a new one
            cart = new Cart({ user: userId, products: [] });
        }

        // Add the product to the cart's products array
        cart.products.push(productId);
        await cart.save();

        res.json({ message: 'Product added to cart', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

cartRouter.delete('/cart/remove/:productId', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const productId = req.params.productId;

        // Find the user's cart
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the product from the cart's products array
        cart.products.pull(productId);
        await cart.save();

        res.json({ message: 'Product removed from cart', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

module.exports = cartRouter;
