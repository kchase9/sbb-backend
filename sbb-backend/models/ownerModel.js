const pool = require('../config/db');

class OwnerModel {
  // Create a new owner
  static async create(ownerData) {
    const {
      registration_id,
      full_name,
      marital_status,
      position_title,
      gender,
      tin,
      birthdate,
      differently_abled,
      id_number,
      education_level
    } = ownerData;

    const query = `
      INSERT INTO owners (
        registration_id,
        full_name,
        marital_status,
        position_title,
        gender,
        tin,
        birthdate,
        differently_abled,
        id_number,
        education_level
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      registration_id,
      full_name,
      marital_status,
      position_title,
      gender,
      tin,
      birthdate,
      differently_abled,
      id_number,
      education_level
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating owner: ${error.message}`);
    }
  }

  // Get owner by ID
  static async findById(id) {
    try {
      const query = `
        SELECT o.*, r.business_name
        FROM owners o
        JOIN registrations r ON o.registration_id = r.id
        WHERE o.id = $1;
      `;
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding owner: ${error.message}`);
    }
  }

  // Get all owners for a registration
  static async findByRegistrationId(registrationId) {
    try {
      const query = `
        SELECT *
        FROM owners
        WHERE registration_id = $1
        ORDER BY created_at DESC;
      `;
      const { rows } = await pool.query(query, [registrationId]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting registration owners: ${error.message}`);
    }
  }

  // Update owner
  static async update(id, ownerData) {
    const columns = Object.keys(ownerData)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const query = `
      UPDATE owners
      SET ${columns}
      WHERE id = $${Object.keys(ownerData).length + 1}
      RETURNING *;
    `;

    const values = [...Object.values(ownerData), id];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error updating owner: ${error.message}`);
    }
  }

  // Delete owner
  static async delete(id) {
    try {
      const query = 'DELETE FROM owners WHERE id = $1 RETURNING *';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error deleting owner: ${error.message}`);
    }
  }

  // Search owners
  static async search(searchTerm) {
    try {
      const query = `
        SELECT o.*, r.business_name
        FROM owners o
        JOIN registrations r ON o.registration_id = r.id
        WHERE 
          o.full_name ILIKE $1 OR
          o.tin ILIKE $1 OR
          o.id_number ILIKE $1
        ORDER BY o.created_at DESC;
      `;
      const { rows } = await pool.query(query, [`%${searchTerm}%`]);
      return rows;
    } catch (error) {
      throw new Error(`Error searching owners: ${error.message}`);
    }
  }

  // Get owners by education level
  static async findByEducationLevel(educationLevel) {
    try {
      const query = `
        SELECT o.*, r.business_name
        FROM owners o
        JOIN registrations r ON o.registration_id = r.id
        WHERE o.education_level = $1
        ORDER BY o.created_at DESC;
      `;
      const { rows } = await pool.query(query, [educationLevel]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting owners by education level: ${error.message}`);
    }
  }

  // Get all owners with pagination
  static async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const query = `
        SELECT o.*, 
               r.business_name,
               COUNT(*) OVER() as total_count
        FROM owners o
        JOIN registrations r ON o.registration_id = r.id
        ORDER BY o.created_at DESC
        LIMIT $1 OFFSET $2;
      `;
      const { rows } = await pool.query(query, [limit, offset]);
      return {
        owners: rows,
        total: rows.length > 0 ? parseInt(rows[0].total_count) : 0,
        page,
        limit
      };
    } catch (error) {
      throw new Error(`Error getting all owners: ${error.message}`);
    }
  }

  // Get statistics about owners
  static async getStatistics() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_owners,
          COUNT(DISTINCT registration_id) as total_businesses,
          COUNT(CASE WHEN differently_abled THEN 1 END) as differently_abled_count,
          COUNT(DISTINCT education_level) as education_levels_count
        FROM owners;
      `;
      const { rows } = await pool.query(query);
      return rows[0];
    } catch (error) {
      throw new Error(`Error getting owner statistics: ${error.message}`);
    }
  }
}

module.exports = OwnerModel;