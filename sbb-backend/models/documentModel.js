const pool = require('../config/db');

class DocumentModel {
  // Upload a new document
  static async create(documentData) {
    const {
      user_id,
      document_type,
      filename,
      file_type,
      file_size,
      file_data
    } = documentData;

    const query = `
      INSERT INTO documents (
        user_id,
        document_type,
        filename,
        file_type,
        file_size,
        file_data
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, document_type, filename, file_type, file_size, uploaded_at;
    `;

    const values = [
      user_id,
      document_type,
      filename,
      file_type,
      file_size,
      file_data
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  // Get document by ID
  static async findById(id) {
    try {
      const query = `
        SELECT id, user_id, document_type, filename, file_type, file_size, file_data, uploaded_at
        FROM documents
        WHERE id = $1;
      `;
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  // Get all documents for a user
  static async findByUserId(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const query = `
        SELECT 
          id, document_type, filename, file_type, file_size, uploaded_at,
          COUNT(*) OVER() as total_count
        FROM documents
        WHERE user_id = $1
        ORDER BY uploaded_at DESC
        LIMIT $2 OFFSET $3;
      `;
      const { rows } = await pool.query(query, [userId, limit, offset]);
      return {
        documents: rows,
        total: rows.length > 0 ? parseInt(rows[0].total_count) : 0,
        page,
        limit
      };
    } catch (error) {
      throw new Error(`Error getting user documents: ${error.message}`);
    }
  }

  // Update document metadata
  static async update(id, documentData) {
    const { document_type, filename } = documentData;

    const query = `
      UPDATE documents
      SET 
        document_type = COALESCE($1, document_type),
        filename = COALESCE($2, filename)
      WHERE id = $3
      RETURNING id, user_id, document_type, filename, file_type, file_size, uploaded_at;
    `;

    try {
      const { rows } = await pool.query(query, [document_type, filename, id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  // Delete document
  static async delete(id) {
    try {
      const query = 'DELETE FROM documents WHERE id = $1 RETURNING id';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  // Get documents by type
  static async findByType(userId, documentType) {
    try {
      const query = `
        SELECT id, document_type, filename, file_type, file_size, uploaded_at
        FROM documents
        WHERE user_id = $1 AND document_type = $2
        ORDER BY uploaded_at DESC;
      `;
      const { rows } = await pool.query(query, [userId, documentType]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting documents by type: ${error.message}`);
    }
  }

  // Check if document exists
  static async exists(userId, documentType) {
    try {
      const query = `
        SELECT EXISTS(
          SELECT 1 FROM documents 
          WHERE user_id = $1 AND document_type = $2
        );
      `;
      const { rows } = await pool.query(query, [userId, documentType]);
      return rows[0].exists;
    } catch (error) {
      throw new Error(`Error checking document existence: ${error.message}`);
    }
  }
}

module.exports = DocumentModel;