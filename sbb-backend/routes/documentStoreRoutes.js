// routes/documentStoreRoutes.js
const express = require('express');
const router = express.Router();
const documentStoreController = require('../controllers/documentStoreController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/upload', authenticateToken, documentStoreController.uploadDocument);
router.get('/user/:user_id', authenticateToken, documentStoreController.getUserDocuments);
// router.get('/status/:user_id', authenticateToken, documentStoreController.getDocumentStatus);
router.get('/:id', authenticateToken, documentStoreController.getDocument);
router.delete('/:id', authenticateToken, documentStoreController.deleteDocument);

module.exports = router;