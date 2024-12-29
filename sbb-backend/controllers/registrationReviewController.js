// controllers/registrationReviewController.js
const RegistrationReviewModel = require('../models/registrationReviewModel');

const registrationReviewController = {
    // Create a new review
    async createReview(req, res) {
        try {
            const review = await RegistrationReviewModel.create(req.body);
            res.status(201).json(review);
        } catch (err) {
            console.error('Error creating review:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Get review by ID
    async getReviewById(req, res) {
        try {
            const review = await RegistrationReviewModel.findById(req.params.id);
            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.json(review);
        } catch (err) {
            console.error('Error getting review:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Get review by registration ID
    async getRegistrationReview(req, res) {
        try {
            const review = await RegistrationReviewModel.findByRegistrationId(req.params.registration_id);
            if (!review) {
                return res.status(404).json({ error: 'No review found for this registration' });
            }
            res.json(review);
        } catch (err) {
            console.error('Error getting registration review:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Update review
    async updateReview(req, res) {
        try {
            const review = await RegistrationReviewModel.update(req.params.id, req.body);
            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.json(review);
        } catch (err) {
            console.error('Error updating review:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Delete review
    async deleteReview(req, res) {
        try {
            const review = await RegistrationReviewModel.delete(req.params.id);
            if (!review) {
                return res.status(404).json({ error: 'Review not found' });
            }
            res.json({ message: 'Review deleted successfully' });
        } catch (err) {
            console.error('Error deleting review:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Get all reviews with pagination
    async getAllReviews(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const reviews = await RegistrationReviewModel.findAll(page, limit);
            res.json(reviews);
        } catch (err) {
            console.error('Error getting all reviews:', err);
            res.status(500).json({ error: err.message });
        }
    },

    // Get reviews by status
    async getReviewsByStatus(req, res) {
        try {
            const reviews = await RegistrationReviewModel.findByStatus(req.params.status);
            res.json(reviews);
        } catch (err) {
            console.error('Error getting reviews by status:', err);
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = registrationReviewController;