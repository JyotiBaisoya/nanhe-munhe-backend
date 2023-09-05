// routes/products.js
const express = require('express');
const Product = require('../models/product');
const authenticateToken = require('../middleware/authenticator'); // Import authentication middleware

const productRouter = express.Router();


productRouter.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

productRouter.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id
        const products = await Product.find({_id:id});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


// POST: Create a new product (protected route)
productRouter.post('/products', async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        const newProduct = new Product({ name, description, price, category, image });
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});


// PUT: Update a product by ID (protected route)
productRouter.put('/products/:id', authenticateToken, async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, image },
            { new: true } // Return the updated document
        );
        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// DELETE: Delete a product by ID (protected route)
productRouter.delete('/products/:id', authenticateToken, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

module.exports = productRouter;
