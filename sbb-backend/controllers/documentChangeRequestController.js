// // controllers/documentChangeRequestController.js
// const DocumentChangeRequest = require('../models/documentChangeRequestModel');
// const DocumentStoreModel = require('../models/documentStoreModel');
// const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ 
//     storage: storage,
//     limits: {
//         fileSize: 10 * 1024 * 1024, // 10MB limit
//     }
// });

// const documentChangeRequestController = {
//     createRequest: [
//         upload.single('file'),
//         async (req, res) => {
//             try {
//                 if (!req.file) {
//                     return res.status(400).json({ error: 'No file uploaded' });
//                 }

//                 // First store the new document (but mark it as pending)
//                 const documentData = {
//                     user_id: req.body.userId,
//                     document_type: req.body.documentType,
//                     filename: req.file.originalname,
//                     file_type: req.file.mimetype,
//                     file_size: req.file.size,
//                     file_data: req.file.buffer,
//                     status: 'pending' // Add this status to your document_store table
//                 };

//                 const savedDocument = await DocumentStoreModel.create(documentData);

//                 // Create the change request
//                 const changeRequest = await DocumentChangeRequest.create({
//                     user_id: req.body.userId,
//                     document_type: req.body.documentType,
//                     reason: req.body.reason,
//                     other_reason: req.body.otherReason || null,
//                     new_document_id: savedDocument.id,
//                     status: 'pending'
//                 });

//                 res.status(201).json({
//                     message: 'Document change request submitted successfully',
//                     request: changeRequest
//                 });
//             } catch (err) {
//                 console.error('Error creating change request:', err);
//                 res.status(500).json({ error: 'Error submitting change request' });
//             }
//         }
//     ],

//     getUserRequests: async (req, res) => {
//         try {
//             const requests = await DocumentChangeRequest.findByUserId(req.params.userId);
//             res.json(requests);
//         } catch (err) {
//             console.error('Error fetching user requests:', err);
//             res.status(500).json({ error: 'Error fetching requests' });
//         }
//     },

//     getPendingRequests: async (req, res) => {
//         try {
//             const requests = await DocumentChangeRequest.findPending();
//             res.json(requests);
//         } catch (err) {
//             console.error('Error fetching pending requests:', err);
//             res.status(500).json({ error: 'Error fetching pending requests' });
//         }
//     },

//     approveRequest: async (req, res) => {
//         const client = await pool.connect();
//         try {
//             await client.query('BEGIN');

//             // Get the change request
//             const request = await DocumentChangeRequest.findById(req.params.requestId);
//             if (!request) {
//                 return res.status(404).json({ error: 'Request not found' });
//             }

//             // Get the new document
//             const newDocument = await DocumentStoreModel.findById(request.new_document_id);
//             if (!newDocument) {
//                 return res.status(404).json({ error: 'New document not found' });
//             }

//             // Find and delete the old document
//             const oldDocuments = await DocumentStoreModel.findByUserIdAndType(
//                 request.user_id,
//                 request.document_type
//             );
            
//             for (const oldDoc of oldDocuments) {
//                 if (oldDoc.status === 'active') {
//                     await DocumentStoreModel.delete(oldDoc.id);
//                 }
//             }

//             // Activate the new document
//             await DocumentStoreModel.updateStatus(newDocument.id, 'active');

//             // Update request status
//             await DocumentChangeRequest.updateStatus(
//                 request.id, 
//                 'approved',
//                 req.user.id // Admin user ID
//             );

//             await client.query('COMMIT');
//             res.json({ message: 'Request approved successfully' });
//         } catch (err) {
//             await client.query('ROLLBACK');
//             console.error('Error approving request:', err);
//             res.status(500).json({ error: 'Error approving request' });
//         } finally {
//             client.release();
//         }
//     },

//     rejectRequest: async (req, res) => {
//         const client = await pool.connect();
//         try {
//             await client.query('BEGIN');

//             // Get the change request
//             const request = await DocumentChangeRequest.findById(req.params.requestId);
//             if (!request) {
//                 return res.status(404).json({ error: 'Request not found' });
//             }

//             // Delete the pending document
//             await DocumentStoreModel.delete(request.new_document_id);

//             // Delete the change request
//             await DocumentChangeRequest.delete(request.id);

//             await client.query('COMMIT');
//             res.json({ message: 'Request rejected successfully' });
//         } catch (err) {
//             await client.query('ROLLBACK');
//             console.error('Error rejecting request:', err);
//             res.status(500).json({ error: 'Error rejecting request' });
//         } finally {
//             client.release();
//         }
//     }
// };

// module.exports = documentChangeRequestController;


const DocumentChangeRequest = require('../models/documentChangeRequestModel');
const multer = require('multer');
const pool = require('../config/db');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

const uploadMiddleware = upload.single('file');

const documentChangeRequestController = {
    createRequest: async (req, res) => {
        try {
            uploadMiddleware(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }

                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }

                const client = await pool.connect();
                try {
                    await client.query('BEGIN');

                    // Store the new document
                    const documentQuery = `
                        INSERT INTO document_store (
                            user_id,
                            document_type,
                            filename,
                            file_type,
                            file_size,
                            file_data
                        )
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING id;
                    `;
                    const documentValues = [
                        req.body.userId,
                        req.body.documentType,
                        req.file.originalname,
                        req.file.mimetype,
                        req.file.size,
                        req.file.buffer
                    ];
                    const documentResult = await client.query(documentQuery, documentValues);
                    const newDocumentId = documentResult.rows[0].id;

                    // Create the change request
                    const requestQuery = `
                        INSERT INTO document_change_requests (
                            user_id,
                            document_type,
                            reason,
                            other_reason,
                            new_document_id,
                            status
                        )
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING *;
                    `;
                    const requestValues = [
                        req.body.userId,
                        req.body.documentType,
                        req.body.reason,
                        req.body.otherReason || null,
                        newDocumentId,
                        'pending'
                    ];
                    const requestResult = await client.query(requestQuery, requestValues);

                    await client.query('COMMIT');
                    res.status(201).json({
                        message: 'Document change request submitted successfully',
                        request: requestResult.rows[0]
                    });
                } catch (error) {
                    await client.query('ROLLBACK');
                    throw error;
                } finally {
                    client.release();
                }
            });
        } catch (err) {
            console.error('Error creating change request:', err);
            res.status(500).json({ error: 'Error submitting change request' });
        }
    },

    getUserRequests: async (req, res) => {
        try {
            const requests = await DocumentChangeRequest.findByUserId(req.params.userId);
            res.json(requests);
        } catch (err) {
            console.error('Error fetching user requests:', err);
            res.status(500).json({ error: 'Error fetching requests' });
        }
    },

    getPendingRequests: async (req, res) => {
        try {
            const requests = await DocumentChangeRequest.findPending();
            res.json(requests);
        } catch (err) {
            console.error('Error fetching pending requests:', err);
            res.status(500).json({ error: 'Error fetching pending requests' });
        }
    },

    approveRequest: async (req, res) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Get the change request
            const request = await DocumentChangeRequest.findById(req.params.requestId);
            if (!request) {
                return res.status(404).json({ error: 'Request not found' });
            }

            // Delete any existing documents of the same type
            await client.query(
                'DELETE FROM document_store WHERE user_id = $1 AND document_type = $2 AND id != $3',
                [request.user_id, request.document_type, request.new_document_id]
            );

            // Update request status
            await DocumentChangeRequest.updateStatus(
                request.id,
                'approved',
                req.user.id
            );

            await client.query('COMMIT');
            res.json({ message: 'Request approved successfully' });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error approving request:', err);
            res.status(500).json({ error: 'Error approving request' });
        } finally {
            client.release();
        }
    },

    rejectRequest: async (req, res) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Get the change request
            const request = await DocumentChangeRequest.findById(req.params.requestId);
            if (!request) {
                return res.status(404).json({ error: 'Request not found' });
            }
            // Delete the change request
            await client.query(
                'DELETE FROM document_change_requests WHERE id = $1',
                [req.params.requestId]
            );

            // Delete the new document from document_store
            await client.query(
                'DELETE FROM document_store WHERE id = $1',
                [request.new_document_id]
            );

            

            await client.query('COMMIT');
            res.json({ message: 'Request rejected and documents deleted successfully' });
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('Error rejecting request:', err);
            res.status(500).json({ error: 'Error rejecting request' });
        } finally {
            client.release();
        }
    }
};

module.exports = documentChangeRequestController;