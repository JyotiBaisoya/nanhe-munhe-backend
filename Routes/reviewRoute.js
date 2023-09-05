const express = require('express');
const reviewRouter = express.Router();
const Review = require('../models/review');
const authenticateToken = require('../middleware/authenticator');

// Create a new review
reviewRouter.post('/', authenticateToken, async (req, res) => {
    try {
        const { product,  comment } = req.body;

        const review = new Review({
            user:req.user.userId,
            product,
          
            comment,
        });

        const savedReview = await review.save();
        res.status(201).json({ message: 'Review created successfully', review: savedReview });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Unable to create the review' });
    }
});

// Get all reviews for a product
reviewRouter.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await Review.find({ product: productId }).populate('user');
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch reviews' });
    }
});

// Update a review
reviewRouter.put('/:reviewId', authenticateToken, async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        // Find the review by ID
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if the user owns the review
        if (review.user.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this review' });
        }

        // Update the review
        review.rating = rating;
        review.comment = comment;
        await review.save();

        res.json({ message: 'Review updated successfully', review });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Unable to update the review' });
    }
});


// Delete a review
reviewRouter.delete('/:reviewId', authenticateToken, async (req, res) => {
    try {
        const { reviewId } = req.params;

        // Find the review by ID
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if the user owns the review
        if (review.user.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this review' });
        }

        // Delete the review
        await review.remove();

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Unable to delete the review' });
    }
});


module.exports = reviewRouter;
