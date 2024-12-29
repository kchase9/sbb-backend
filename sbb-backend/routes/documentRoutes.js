
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const documentStoreController = require('../controllers/documentStoreController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Document store routes
router.post('/upload', authenticateToken, documentStoreController.uploadDocument[0], documentStoreController.uploadDocument[1]);
router.get('/user/:user_id', authenticateToken, documentStoreController.getUserDocuments);
router.get('/:id', authenticateToken, documentStoreController.getDocument);
router.delete('/:id', authenticateToken, documentStoreController.deleteDocument);

// Document status routes
router.get('/status/:user_id', authenticateToken, documentController.getDocumentStatus);
router.post('/initialize/:user_id', authenticateToken, documentController.initializeDocumentStatus);

module.exports = router;