const DocumentStoreModel = require('../models/documentStoreModel');
const DocumentModel = require('../models/documentModel');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Helper function to map document types to column names
const getColumnName = (documentType) => {
  const columnMap = {
    'Business Registration': 'business_registration',
    'TIN': 'tin_certificate',
    'NIS': 'nis_certificate',
    'GRA Compliance Letter': 'gra_compliance_letter',
    'NIS Compliance Letter': 'nis_compliance_letter',
    'Operational License(s)': 'operational_license',
    'Compliance Standard(s) Certificates': 'compliance_certificate',
    'Owner TIN Certificate': 'owner_tin_certificate',
    'ID Card(s)': 'id_cards'
  };
  return columnMap[documentType];
};

const documentStoreController = {
  uploadDocument: [
    upload.single('file'),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.body.userId;
        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }

        // Store file in document_store
        const documentData = {
          user_id: userId,
          document_type: req.body.documentType,
          filename: req.file.originalname,
          file_type: req.file.mimetype,
          file_size: req.file.size,
          file_data: req.file.buffer
        };

        const savedDocument = await DocumentStoreModel.create(documentData);

        // Update the corresponding flag in documents table
        const columnName = getColumnName(req.body.documentType);
        if (columnName) {
          await DocumentModel.updateDocumentStatus(userId, columnName, true);
        }

        res.status(201).json({
          message: 'Document uploaded successfully',
          document: {
            id: savedDocument.id,
            filename: savedDocument.filename,
            document_type: savedDocument.document_type,
            uploaded_at: savedDocument.uploaded_at
          }
        });
      } catch (err) {
        console.error('Error uploading document:', err);
        res.status(500).json({ error: 'Error uploading document' });
      }
    }
  ],

  getUserDocuments: async (req, res) => {
    try {
      const userId = req.params.user_id;
      const documents = await DocumentStoreModel.findByUserId(userId);
      const documentStatus = await DocumentModel.findByUserId(userId);
      
      res.json({
        documents,
        documentStatus
      });
    } catch (err) {
      console.error('Error getting user documents:', err);
      res.status(500).json({ error: 'Error retrieving documents' });
    }
  },

  getDocument: async (req, res) => {
    try {
      const document = await DocumentStoreModel.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      res.setHeader('Content-Type', document.file_type);
      res.setHeader('Content-Disposition', `inline; filename="${document.filename}"`);
      res.send(document.file_data);
    } catch (err) {
      console.error('Error getting document:', err);
      res.status(500).json({ error: 'Error retrieving document' });
    }
  },

  deleteDocument: async (req, res) => {
    try {
      const document = await DocumentStoreModel.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Delete the file from document_store
      await DocumentStoreModel.delete(req.params.id);

      // Check if there are any other documents of this type
      const remainingDocs = await DocumentStoreModel.findByUserIdAndType(
        document.user_id,
        document.document_type
      );

      // If no more documents of this type exist, update the status
      const columnName = getColumnName(document.document_type);
      if (columnName && remainingDocs.length === 0) {
        await DocumentModel.updateDocumentStatus(document.user_id, columnName, false);
      }

      res.json({ message: 'Document deleted successfully' });
    } catch (err) {
      console.error('Error deleting document:', err);
      res.status(500).json({ error: 'Error deleting document' });
    }
  }
};

module.exports = documentStoreController;