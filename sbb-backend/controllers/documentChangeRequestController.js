
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
    
            // Update the status of the change request to "approved"
            await DocumentChangeRequest.updateStatus(request.id, 'approved', req.user.id);
    
            // Get all existing documents of the same type
            const existingDocsQuery = await client.query(
                'SELECT id FROM document_store WHERE user_id = $1 AND document_type = $2 AND id != $3',
                [request.user_id, request.document_type, request.new_document_id]
            );
    
            // Delete each document individually to avoid foreign key issues
            for (const doc of existingDocsQuery.rows) {
                // Check if this document is referenced by any other pending requests
                const pendingRequestsQuery = await client.query(
                    'SELECT id FROM document_change_requests WHERE new_document_id = $1 AND status = $2',
                    [doc.id, 'pending']
                );
    
                // Delete the document only if it's not referenced
                if (pendingRequestsQuery.rows.length === 0) {
                    await client.query(
                        'DELETE FROM document_store WHERE id = $1',
                        [doc.id]
                    );
                }
            }
    
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

            // Store the document ID for later deletion
            const documentIdToDelete = request.new_document_id;

            // First delete the change request (removes the foreign key constraint)
            await client.query(
                'DELETE FROM document_change_requests WHERE id = $1',
                [req.params.requestId]
            );

            // Then delete the document from document_store
            if (documentIdToDelete) {
                await client.query(
                    'DELETE FROM document_store WHERE id = $1',
                    [documentIdToDelete]
                );
            }

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