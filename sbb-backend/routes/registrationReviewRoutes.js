// routes/registrationReviewRoutes.js
const express = require('express');
const router = express.Router();
const registrationReviewController = require('../controllers/registrationReviewController');

// Create new review
router.post('/', registrationReviewController.createReview);

// Get all reviews with pagination
router.get('/', registrationReviewController.getAllReviews);

// Get review by ID
router.get('/:id', registrationReviewController.getReviewById);

// Get review by registration ID
router.get('/registration/:registration_id', registrationReviewController.getRegistrationReview);

// Get reviews by status
router.get('/status/:status', registrationReviewController.getReviewsByStatus);

// Update review
router.put('/:id', registrationReviewController.updateReview);

// Delete review
router.delete('/:id', registrationReviewController.deleteReview);

module.exports = router;