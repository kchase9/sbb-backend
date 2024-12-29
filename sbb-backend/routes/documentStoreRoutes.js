// routes/documentStoreRoutes.js
const express = require('express');
const router = express.Router();
const documentStoreController = require('../controllers/documentStoreController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Protected routes (require authentication)
router.post('/upload', authenticateToken, documentStoreController.uploadDocument);
router.get('/user/:user_id', authenticateToken, documentStoreController.getUserDocuments);
router.get('/:id', authenticateToken, documentStoreController.getDocument);
router.delete('/:id', authenticateToken, documentStoreController.deleteDocument);

module.exports = router;