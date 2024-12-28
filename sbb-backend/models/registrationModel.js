
// const pool = require('../config/db');

// const createRegistration = async (businessName, ownerName, email, phone) => {
//   const result = await pool.query(
//     'INSERT INTO registrations (business_name, owner_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
//     [businessName, ownerName, email, phone]
//   );
//   return result.rows[0];
// };

// const getAllRegistrations = async () => {
//   const result = await pool.query('SELECT * FROM registrations');
//   return result.rows;
// };

// module.exports = { createRegistration, getAllRegistrations };

const pool = require('../config/db');

class RegistrationModel {
  // Create a new registration
  static async create(registrationData) {
    const {
      business_name,
      trading_name,
      registration_type,
      primary_contact_name,
      primary_contact_phone,
      primary_contact_email,
      secondary_contact_name,
      secondary_contact_phone,
      secondary_contact_email,
      physical_address,
      trading_address,
      mailing_address,
      business_email,
      business_website,
      business_phone,
      primary_business_sector,
      business_outline,
      industry_types,
      business_tin,
      tin_registered_date,
      business_vat,
      vat_registered_date,
      business_nis,
      nis_registered_date,
      business_registration_location,
      date_business_commenced,
      compliance_history_paye_number,
      compliance_history_income_tax_number,
      compliance_history_vat_number,
      compliance_history_nis_number,
      owned_controlled,
      subsidiary_affiliate,
      charitable_political,
      declaration_primary_name,
      declaration_primary_signature,
      declaration_primary_position,
      declaration_primary_date,
      declaration_secondary_name,
      declaration_secondary_signature,
      declaration_secondary_position,
      declaration_secondary_date
    } = registrationData;

    const query = `
      INSERT INTO registrations (
        business_name, trading_name, registration_type,
        primary_contact_name, primary_contact_phone, primary_contact_email,
        secondary_contact_name, secondary_contact_phone, secondary_contact_email,
        physical_address, trading_address, mailing_address,
        business_email, business_website, business_phone,
        primary_business_sector, business_outline, industry_types,
        business_tin, tin_registered_date, business_vat, vat_registered_date,
        business_nis, nis_registered_date, business_registration_location,
        date_business_commenced, compliance_history_paye_number,
        compliance_history_income_tax_number, compliance_history_vat_number,
        compliance_history_nis_number, owned_controlled, subsidiary_affiliate,
        charitable_political, declaration_primary_name, declaration_primary_signature,
        declaration_primary_position, declaration_primary_date,
        declaration_secondary_name, declaration_secondary_signature,
        declaration_secondary_position, declaration_secondary_date
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41
      )
      RETURNING *;
    `;

    const values = [
      business_name, trading_name, registration_type,
      primary_contact_name, primary_contact_phone, primary_contact_email,
      secondary_contact_name, secondary_contact_phone, secondary_contact_email,
      physical_address, trading_address, mailing_address,
      business_email, business_website, business_phone,
      primary_business_sector, business_outline, industry_types,
      business_tin, tin_registered_date, business_vat, vat_registered_date,
      business_nis, nis_registered_date, business_registration_location,
      date_business_commenced, compliance_history_paye_number,
      compliance_history_income_tax_number, compliance_history_vat_number,
      compliance_history_nis_number, owned_controlled, subsidiary_affiliate,
      charitable_political, declaration_primary_name, declaration_primary_signature,
      declaration_primary_position, declaration_primary_date,
      declaration_secondary_name, declaration_secondary_signature,
      declaration_secondary_position, declaration_secondary_date
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating registration: ${error.message}`);
    }
  }

  // Find registration by ID
  static async findById(id) {
    try {
      const query = `
        SELECT r.*, 
               json_agg(o.*) as owners
        FROM registrations r
        LEFT JOIN owners o ON r.id = o.registration_id
        WHERE r.id = $1
        GROUP BY r.id;
      `;
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding registration: ${error.message}`);
    }
  }

  // Get all registrations with pagination and optional filters
  static async findAll(page = 1, limit = 10, filters = {}) {
    try {
      let query = `
        SELECT r.*, 
               COUNT(*) OVER() as total_count
        FROM registrations r
        WHERE 1 = 1
      `;
      
      const values = [];
      let paramCount = 1;

      // Add filters
      if (filters.business_name) {
        query += ` AND r.business_name ILIKE $${paramCount}`;
        values.push(`%${filters.business_name}%`);
        paramCount++;
      }

      if (filters.registration_type) {
        query += ` AND r.registration_type = $${paramCount}`;
        values.push(filters.registration_type);
        paramCount++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY r.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      values.push(limit, offset);

      const { rows } = await pool.query(query, values);
      return {
        registrations: rows,
        total: rows.length > 0 ? parseInt(rows[0].total_count) : 0,
        page,
        limit
      };
    } catch (error) {
      throw new Error(`Error getting registrations: ${error.message}`);
    }
  }

  // Update registration
  static async update(id, registrationData) {
    // Similar to create, but with UPDATE query
    const columns = Object.keys(registrationData)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const query = `
      UPDATE registrations
      SET ${columns},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $${Object.keys(registrationData).length + 1}
      RETURNING *;
    `;

    const values = [...Object.values(registrationData), id];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error updating registration: ${error.message}`);
    }
  }

  // Delete registration
  static async delete(id) {
    try {
      const query = 'DELETE FROM registrations WHERE id = $1 RETURNING *';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error deleting registration: ${error.message}`);
    }
  }

  // Search registrations
  static async search(searchTerm) {
    try {
      const query = `
        SELECT *
        FROM registrations
        WHERE 
          business_name ILIKE $1 OR
          trading_name ILIKE $1 OR
          primary_contact_name ILIKE $1 OR
          business_email ILIKE $1
        ORDER BY created_at DESC;
      `;
      const { rows } = await pool.query(query, [`%${searchTerm}%`]);
      return rows;
    } catch (error) {
      throw new Error(`Error searching registrations: ${error.message}`);
    }
  }
}

module.exports = RegistrationModel;