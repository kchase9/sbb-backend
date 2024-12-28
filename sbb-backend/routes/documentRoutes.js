// const express = require('express');
// const multer = require('multer');
// const { saveDocument, getDocument } = require('../controllers/documentController');

// const router = express.Router();
// const upload = multer(); // Using multer for handling file uploads

// router.post('/upload', upload.single('file'), saveDocument);
// router.get('/:id', getDocument);

// module.exports = router;
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// Document routes
router.post('/upload', documentController.uploadDocument);
router.get('/user/:user_id', documentController.getUserDocuments);
router.get('/:id', documentController.getDocument);
router.put('/:id', documentController.updateDocument);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;