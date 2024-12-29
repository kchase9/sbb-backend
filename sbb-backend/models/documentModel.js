// const pool = require('../config/db');

// class DocumentModel {
//   static async create(userId) {
//     try {
//       const query = `
//         INSERT INTO documents (
//           user_id,
//           business_registration,
//           tin_certificate,
//           nis_certificate,
//           gra_compliance_letter,
//           nis_compliance_letter,
//           operational_license,
//           compliance_certificate,
//           owner_tin_certificate,
//           id_cards
//         ) VALUES ($1, false, false, false, false, false, false, false, false, false)
//         RETURNING *;
//       `;
//       const { rows } = await pool.query(query, [userId]);
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error creating document record: ${error.message}`);
//     }
//   }

//   static async findByUserId(userId) {
//     try {
//       const query = 'SELECT * FROM documents WHERE user_id = $1';
//       const { rows } = await pool.query(query, [userId]);
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error finding document: ${error.message}`);
//     }
//   }

//   static async updateDocumentStatus(userId, documentType, status) {
//     try {
//       const query = `
//         UPDATE documents 
//         SET ${documentType} = $1 
//         WHERE user_id = $2 
//         RETURNING *;
//       `;
//       const { rows } = await pool.query(query, [status, userId]);
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error updating document status: ${error.message}`);
//     }
//   }

//   static async deleteByUserId(userId) {
//     try {
//       const query = 'DELETE FROM documents WHERE user_id = $1 RETURNING *';
//       const { rows } = await pool.query(query, [userId]);
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error deleting document: ${error.message}`);
//     }
//   }
// }

// module.exports = DocumentModel;


const pool = require('../config/db');

class DocumentModel {
    static async create(userId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
                INSERT INTO documents (
                    user_id,
                    business_registration,
                    tin_certificate,
                    nis_certificate,
                    gra_compliance_letter,
                    nis_compliance_letter,
                    operational_license,
                    compliance_certificate,
                    owner_tin_certificate,
                    id_cards
                ) VALUES ($1, false, false, false, false, false, false, false, false, false)
                RETURNING *;
            `;

            const { rows } = await client.query(query, [userId]);
            await client.query('COMMIT');
            return rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error(`Error creating document record: ${error.message}`);
        } finally {
            client.release();
        }
    }

    static async updateDocumentStatus(userId, documentType, status) {
      const client = await pool.connect();
      try {
          await client.query('BEGIN');

          const query = `
              UPDATE documents 
              SET ${documentType} = $1 
              WHERE user_id = $2 
              RETURNING *;
          `;

          const { rows } = await client.query(query, [status, userId]);
          
          if (rows.length === 0) {
              // If no record exists, create one
              const newRecord = await this.create(userId);
              // Then update it
              const updateResult = await client.query(query, [status, userId]);
              await client.query('COMMIT');
              return updateResult.rows[0];
          }

          await client.query('COMMIT');
          return rows[0];
      } catch (error) {
          await client.query('ROLLBACK');
          throw new Error(`Error updating document status: ${error.message}`);
      } finally {
          client.release();
      }
  }

    static async findByUserId(userId) {
        try {
            const query = 'SELECT * FROM documents WHERE user_id = $1';
            const { rows } = await pool.query(query, [userId]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error finding document: ${error.message}`);
        }
    }
}

module.exports = DocumentModel;