// // const express = require('express');
// // const multer = require('multer');
// // const { saveDocument, getDocument } = require('../controllers/documentController');

// // const router = express.Router();
// // const upload = multer(); // Using multer for handling file uploads

// // router.post('/upload', upload.single('file'), saveDocument);
// // router.get('/:id', getDocument);

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const documentController = require('../controllers/documentController');
// const { authenticateToken } = require('../middleware/authMiddleware');

// // Add this new route
// router.post('/initialize/:user_id', authenticateToken, documentController.initializeDocumentStatus);

// // Document routes
// router.post('/upload', documentController.uploadDocument);
// router.get('/user/:user_id', documentController.getUserDocuments);
// router.get('/:id', documentController.getDocument);
// router.put('/:id', documentController.updateDocument);
// router.delete('/:id', documentController.deleteDocument);

// module.exports = router;

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