// models/registrationReviewModel.js
const pool = require('../config/db');

class RegistrationReviewModel {
    // Create a new review
    static async create(reviewData) {
        const { registration_id, status, reviewer_comment } = reviewData;
        
        const query = `
            INSERT INTO registration_review (registration_id, status, reviewer_comment)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        try {
            const { rows } = await pool.query(query, [registration_id, status, reviewer_comment]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error creating review: ${error.message}`);
        }
    }

    // Get review by ID
    static async findById(id) {
        try {
            const query = `
                SELECT rr.*, r.business_name 
                FROM registration_review rr
                JOIN registrations r ON rr.registration_id = r.id
                WHERE rr.id = $1;
            `;
            const { rows } = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error finding review: ${error.message}`);
        }
    }

    // Get review by registration ID
    static async findByRegistrationId(registrationId) {
        try {
            const query = `
                SELECT * FROM registration_review
                WHERE registration_id = $1
                ORDER BY created_at DESC;
            `;
            const { rows } = await pool.query(query, [registrationId]);
            return rows[0]; // Return the most recent review
        } catch (error) {
            throw new Error(`Error getting registration review: ${error.message}`);
        }
    }

    // Update review
    static async update(id, reviewData) {
        const { status, reviewer_comment } = reviewData;
        
        const query = `
            UPDATE registration_review
            SET status = $1,
                reviewer_comment = $2,
                created_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *;
        `;

        try {
            const { rows } = await pool.query(query, [status, reviewer_comment, id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error updating review: ${error.message}`);
        }
    }

    // Delete review
    static async delete(id) {
        try {
            const query = 'DELETE FROM registration_review WHERE id = $1 RETURNING *';
            const { rows } = await pool.query(query, [id]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error deleting review: ${error.message}`);
        }
    }

    // Get all reviews with pagination
    static async findAll(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const query = `
                SELECT rr.*, r.business_name,
                       COUNT(*) OVER() as total_count
                FROM registration_review rr
                JOIN registrations r ON rr.registration_id = r.id
                ORDER BY rr.created_at DESC
                LIMIT $1 OFFSET $2;
            `;
            const { rows } = await pool.query(query, [limit, offset]);
            return {
                reviews: rows,
                total: rows.length > 0 ? parseInt(rows[0].total_count) : 0,
                page,
                limit
            };
        } catch (error) {
            throw new Error(`Error getting all reviews: ${error.message}`);
        }
    }

    // Get reviews by status
    static async findByStatus(status) {
        try {
            const query = `
                SELECT rr.*, r.business_name
                FROM registration_review rr
                JOIN registrations r ON rr.registration_id = r.id
                WHERE rr.status = $1
                ORDER BY rr.created_at DESC;
            `;
            const { rows } = await pool.query(query, [status]);
            return rows;
        } catch (error) {
            throw new Error(`Error getting reviews by status: ${error.message}`);
        }
    }
}

module.exports = RegistrationReviewModel;