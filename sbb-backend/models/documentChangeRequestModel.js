// models/documentChangeRequest.js
const pool = require('../config/db');

class DocumentChangeRequest {
    static async create(requestData) {
        const { user_id, document_type, reason, other_reason, new_document_id, status = 'pending' } = requestData;
        
        try {
            const query = `
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
            
            const values = [user_id, document_type, reason, other_reason, new_document_id, status];
            const { rows } = await pool.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error creating change request: ${error.message}`);
        }
    }

    static async findByUserId(userId) {
        try {
            const query = `
                SELECT dcr.*, ds.filename, ds.file_type
                FROM document_change_requests dcr
                LEFT JOIN document_store ds ON dcr.new_document_id = ds.id
                WHERE dcr.user_id = $1
                ORDER BY dcr.requested_at DESC;
            `;
            const { rows } = await pool.query(query, [userId]);
            return rows;
        } catch (error) {
            throw new Error(`Error finding user requests: ${error.message}`);
        }
    }

    static async findPending() {
        try {
            const query = `
                SELECT 
                    dcr.*,
                    ds.filename,
                    ds.file_type,
                    u.full_name as user_name,
                    u.email as user_email
                FROM document_change_requests dcr
                LEFT JOIN document_store ds ON dcr.new_document_id = ds.id
                LEFT JOIN users u ON dcr.user_id = u.id
                WHERE dcr.status = 'pending'
                ORDER BY dcr.requested_at ASC;
            `;
            const { rows } = await pool.query(query);
            return rows;
        } catch (error) {
            throw new Error(`Error finding pending requests: ${error.message}`);
        }
    }

    static async findById(id) {
        try {
            const query = `
                SELECT dcr.*, ds.filename, ds.file_type
                FROM document_change_requests dcr
                LEFT JOIN document_store ds ON dcr.new_document_id = ds.id
                WHERE dcr.id = $1;
            `;
            const { rows } = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error finding request: ${error.message}`);
        }
    }

    static async updateStatus(id, status, processedBy) {
        try {
            const query = `
                UPDATE document_change_requests
                SET 
                    status = $1,
                    processed_by = $2,
                    processed_at = CURRENT_TIMESTAMP
                WHERE id = $3
                RETURNING *;
            `;
            const { rows } = await pool.query(query, [status, processedBy, id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error updating request status: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const query = 'DELETE FROM document_change_requests WHERE id = $1 RETURNING *;';
            const { rows } = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error deleting request: ${error.message}`);
        }
    }

    // Helper method to get request with full details
    static async getRequestDetails(id) {
        try {
            const query = `
                SELECT 
                    dcr.*,
                    ds.filename,
                    ds.file_type,
                    u.full_name as user_name,
                    u.email as user_email,
                    pa.full_name as processor_name
                FROM document_change_requests dcr
                LEFT JOIN document_store ds ON dcr.new_document_id = ds.id
                LEFT JOIN users u ON dcr.user_id = u.id
                LEFT JOIN users pa ON dcr.processed_by = pa.id
                WHERE dcr.id = $1;
            `;
            const { rows } = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error getting request details: ${error.message}`);
        }
    }
}

module.exports = DocumentChangeRequest;