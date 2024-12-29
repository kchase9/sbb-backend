const pool = require('../config/db');

class DocumentStoreModel {
  static async create(documentData) {
    const { user_id, document_type, filename, file_type, file_size, file_data } = documentData;
    
    try {
      const query = `
        INSERT INTO document_store (
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
      
      const values = [user_id, document_type, filename, file_type, file_size, file_data];
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating document store record: ${error.message}`);
    }
  }

  static async findByUserId(userId) {
    try {
      const query = `
        SELECT id, user_id, document_type, filename, file_type, file_size, uploaded_at
        FROM document_store 
        WHERE user_id = $1 
        ORDER BY uploaded_at DESC;
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM document_store WHERE id = $1';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  static async findByUserIdAndType(userId, documentType) {
    try {
      const query = `
        SELECT * FROM document_store 
        WHERE user_id = $1 AND document_type = $2
        ORDER BY uploaded_at DESC;
      `;
      const { rows } = await pool.query(query, [userId, documentType]);
      return rows;
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM document_store WHERE id = $1 RETURNING *';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  static async deleteByUserIdAndType(userId, documentType) {
    try {
      const query = `
        DELETE FROM document_store 
        WHERE user_id = $1 AND document_type = $2 
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [userId, documentType]);
      return rows;
    } catch (error) {
      throw new Error(`Error deleting documents: ${error.message}`);
    }
  }
}

module.exports = DocumentStoreModel