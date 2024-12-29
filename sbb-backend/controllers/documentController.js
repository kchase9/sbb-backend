// const DocumentModel = require('../models/documentModel');
// const DocumentStoreModel = require('../models/documentStoreModel');

// const documentController = {
//   async getDocumentStatus(req, res) {
//     try {
//       const userId = req.params.user_id;
//       const documentStatus = await DocumentModel.findByUserId(userId);
      
//       if (!documentStatus) {
//         return res.status(404).json({ error: 'No document status found for this user' });
//       }
      
//       res.json(documentStatus);
//     } catch (err) {
//       console.error('Error getting document status:', err);
//       res.status(500).json({ error: 'Error retrieving document status' });
//     }
//   },

//   async updateDocumentStatus(req, res) {
//     try {
//       const { userId, documentType, status } = req.body;
//       const updatedStatus = await DocumentModel.updateDocumentStatus(
//         userId,
//         documentType,
//         status
//       );
      
//       res.json(updatedStatus);
//     } catch (err) {
//       console.error('Error updating document status:', err);
//       res.status(500).json({ error: 'Error updating document status' });
//     }
//   },

//   async initializeDocumentStatus(req, res) {
//     try {
//       const userId = req.params.user_id;
//       const documentStatus = await DocumentModel.create(userId);
//       res.status(201).json(documentStatus);
//     } catch (err) {
//       console.error('Error initializing document status:', err);
//       res.status(500).json({ error: 'Error initializing document status' });
//     }
//   }
// };

// module.exports = documentController;


const DocumentModel = require('../models/documentModel');

const documentController = {
    getDocumentStatus: async (req, res) => {
        try {
            const userId = req.params.user_id;
            const documentStatus = await DocumentModel.findByUserId(userId);
            
            if (!documentStatus) {
                return res.status(404).json({ error: 'No document status found for this user' });
            }
            
            res.json(documentStatus);
        } catch (err) {
            console.error('Error getting document status:', err);
            res.status(500).json({ error: 'Error retrieving document status' });
        }
    },

    initializeDocumentStatus: async (req, res) => {
        try {
            const userId = req.params.user_id;
            const documentStatus = await DocumentModel.create(userId);
            res.status(201).json(documentStatus);
        } catch (err) {
            console.error('Error initializing document status:', err);
            res.status(500).json({ error: 'Error initializing document status' });
        }
    }
};

module.exports = documentController;