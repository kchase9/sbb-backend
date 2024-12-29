// // routes/documentChangeRequestRoutes.js
// const express = require('express');
// const router = express.Router();
// const documentChangeRequestController = require('../controllers/documentChangeRequestController');
// const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// // User routes
// router.post('/submit', authenticateToken, documentChangeRequestController.createRequest);
// router.get('/user/:userId', authenticateToken, documentChangeRequestController.getUserRequests);

// // Admin routes
// router.get('/pending', authenticateToken, isAdmin, documentChangeRequestController.getPendingRequests);
// router.post('/approve/:requestId', authenticateToken, isAdmin, documentChangeRequestController.approveRequest);
// router.post('/reject/:requestId', authenticateToken, isAdmin, documentChangeRequestController.rejectRequest);

// module.exports = router;

const express = require('express');
const router = express.Router();
const documentChangeRequestController = require('../controllers/documentChangeRequestController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// User routes
router.post('/submit', authenticateToken, documentChangeRequestController.createRequest);
router.get('/user/:userId', authenticateToken, documentChangeRequestController.getUserRequests);

// Admin routes
router.get('/pending', authenticateToken, isAdmin, documentChangeRequestController.getPendingRequests);
router.post('/approve/:requestId', authenticateToken, isAdmin, documentChangeRequestController.approveRequest);
router.post('/reject/:requestId', authenticateToken, isAdmin, documentChangeRequestController.rejectRequest);

module.exports = router;