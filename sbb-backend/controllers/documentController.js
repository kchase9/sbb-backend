// const pool = require('../config/db');

// // Save a document
// const saveDocument = async (req, res) => {
//   try {
//     const { userId, documentType } = req.body;
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     const { originalname: filename, mimetype: fileType, size: fileSize, buffer: fileData } = file;

//     const query = `
//       INSERT INTO documents (user_id, document_type, filename, file_type, file_size, file_data)
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING id
//     `;
//     const values = [userId, documentType, filename, fileType, fileSize, fileData];

//     const result = await pool.query(query, values);

//     res.status(201).json({ documentId: result.rows[0].id, message: 'Document uploaded successfully' });
//   } catch (err) {
//     console.error('Error saving document:', err);
//     res.status(500).json({ message: 'Error saving document' });
//   }
// };

// // Retrieve a document
// const getDocument = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const query = `SELECT filename, file_type, file_data FROM documents WHERE id = $1`;
//     const result = await pool.query(query, [id]);

//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Document not found' });
//     }

//     const { filename, file_type, file_data } = result.rows[0];
//     res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//     res.setHeader('Content-Type', file_type);
//     res.send(file_data);
//   } catch (err) {
//     console.error('Error retrieving document:', err);
//     res.status(500).json({ message: 'Error retrieving document' });
//   }
// };

// module.exports = {
//   saveDocument,
//   getDocument,
// };


// const pool = require('../config/db');


// const documentController = {
//   // Upload a document
//   async uploadDocument(req, res) {
//     const { 
//       user_id, 
//       document_type,
//       filename,
//       file_type,
//       file_size,
//       file_data 
//     } = req.body;

//     try {
//       const query = `
//         INSERT INTO documents (
//           user_id, 
//           document_type,
//           filename,
//           file_type,
//           file_size,
//           file_data
//         )
//         VALUES ($1, $2, $3, $4, $5, $6)
//         RETURNING id, user_id, document_type, filename, file_type, file_size, uploaded_at;
//       `;

//       const values = [
//         user_id,
//         document_type,
//         filename,
//         file_type,
//         file_size,
//         file_data
//       ];

//       const result = await pool.query(query, values);
//       res.status(201).json(result.rows[0]);
//     } catch (err) {
//       console.error('Error uploading document:', err);
//       res.status(500).json({ error: 'Error uploading document' });
//     }
//   },

//   // Get all documents for a user
//   async getUserDocuments(req, res) {
//     const { user_id } = req.params;
//     try {
//       const query = `
//         SELECT id, document_type, filename, file_type, file_size, uploaded_at
//         FROM documents
//         WHERE user_id = $1
//         ORDER BY uploaded_at DESC;
//       `;
      
//       const result = await pool.query(query, [user_id]);
//       res.json(result.rows);
//     } catch (err) {
//       console.error('Error getting user documents:', err);
//       res.status(500).json({ error: 'Error getting user documents' });
//     }
//   },

//   // Get specific document
//   async getDocument(req, res) {
//     const { id } = req.params;
//     try {
//       const query = `        SELECT id, user_id, document_type, filename, file_type, file_size, file_data, uploaded_at
//         FROM documents
//         WHERE id = $1;
//       `;

//       const result = await pool.query(query, [id]);

//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Document not found' });
//       }

//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error('Error getting document:', err);
//       res.status(500).json({ error: 'Error getting document' });
//     }
//   },

//   // Delete a document
//   async deleteDocument(req, res) {
//     const { id } = req.params;

//     try {
//       const query = `
//         DELETE FROM documents
//         WHERE id = $1
//         RETURNING id;
//       `;

//       const result = await pool.query(query, [id]);

//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Document not found or already deleted' });
//       }

//       res.json({ message: 'Document deleted successfully', documentId: result.rows[0].id });
//     } catch (err) {
//       console.error('Error deleting document:', err);
//       res.status(500).json({ error: 'Error deleting document' });
//     }
//   }
// };

// module.exports = documentController;
const DocumentModel = require('../models/documentModel');

const documentController = {
  async uploadDocument(req, res) {
    try {
      const document = await DocumentModel.create(req.body);
      res.status(201).json(document);
    } catch (err) {
      console.error('Error uploading document:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getUserDocuments(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const documents = await DocumentModel.findByUserId(req.params.user_id, page, limit);
      res.json(documents);
    } catch (err) {
      console.error('Error getting user documents:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getDocument(req, res) {
    try {
      const document = await DocumentModel.findById(req.params.id);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(document);
    } catch (err) {
      console.error('Error getting document:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async updateDocument(req, res) {
    try {
      const document = await DocumentModel.update(req.params.id, req.body);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(document);
    } catch (err) {
      console.error('Error updating document:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async deleteDocument(req, res) {
    try {
      const document = await DocumentModel.delete(req.params.id);
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json({ message: 'Document deleted successfully' });
    } catch (err) {
      console.error('Error deleting document:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getDocumentsByType(req, res) {
    try {
      const documents = await DocumentModel.findByType(req.params.user_id, req.params.type);
      res.json(documents);
    } catch (err) {
      console.error('Error getting documents by type:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = documentController;