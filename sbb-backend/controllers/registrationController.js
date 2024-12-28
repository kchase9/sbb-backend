
// const pool = require('../config/db');

// const createRegistration = async (req, res) => {
//   const { business_name, owner_name, email, phone } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO registrations (business_name, owner_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
//       [business_name, owner_name, email, phone]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error creating registration');
//   }
// };

// const getRegistrations = async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM registrations');
//     res.status(200).json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error fetching registrations');
//   }
// };

// module.exports = { createRegistration, getRegistrations };


// const pool = require('../config/db');


// const registrationController = {
//   // Create a new registration
//   async createRegistration(req, res) {
//     const {
//       business_name,
//       trading_name,
//       registration_type,
//       primary_contact_name,
//       primary_contact_phone,
//       primary_contact_email,
//       secondary_contact_name,
//       secondary_contact_phone,
//       secondary_contact_email,
//       physical_address,
//       trading_address,
//       mailing_address,
//       business_email,
//       business_website,
//       business_phone,
//       primary_business_sector,
//       business_outline,
//       industry_types,
//       business_tin,
//       tin_registered_date,
//       business_vat,
//       vat_registered_date,
//       business_nis,
//       nis_registered_date,
//       business_registration_location,
//       date_business_commenced,
//       compliance_history_paye_number,
//       compliance_history_income_tax_number,
//       compliance_history_vat_number,
//       compliance_history_nis_number,
//       owned_controlled,
//       subsidiary_affiliate,
//       charitable_political,
//       declaration_primary_name,
//       declaration_primary_signature,
//       declaration_primary_position,
//       declaration_primary_date,
//       declaration_secondary_name,
//       declaration_secondary_signature,
//       declaration_secondary_position,
//       declaration_secondary_date
//     } = req.body;

//     try {
//       const query = `
//         INSERT INTO registrations (
//           business_name, trading_name, registration_type,
//           primary_contact_name, primary_contact_phone, primary_contact_email,
//           secondary_contact_name, secondary_contact_phone, secondary_contact_email,
//           physical_address, trading_address, mailing_address,
//           business_email, business_website, business_phone,
//           primary_business_sector, business_outline, industry_types,
//           business_tin, tin_registered_date, business_vat, vat_registered_date,
//           business_nis, nis_registered_date, business_registration_location,
//           date_business_commenced, compliance_history_paye_number,
//           compliance_history_income_tax_number, compliance_history_vat_number,
//           compliance_history_nis_number, owned_controlled, subsidiary_affiliate,
//           charitable_political, declaration_primary_name, declaration_primary_signature,
//           declaration_primary_position, declaration_primary_date,
//           declaration_secondary_name, declaration_secondary_signature,
//           declaration_secondary_position, declaration_secondary_date
//         )
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
//                 $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
//                 $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41)
//         RETURNING *;
//       `;

//       const values = [
//         business_name, trading_name, registration_type,
//         primary_contact_name, primary_contact_phone, primary_contact_email,
//         secondary_contact_name, secondary_contact_phone, secondary_contact_email,
//         physical_address, trading_address, mailing_address,
//         business_email, business_website, business_phone,
//         primary_business_sector, business_outline, industry_types,
//         business_tin, tin_registered_date, business_vat, vat_registered_date,
//         business_nis, nis_registered_date, business_registration_location,
//         date_business_commenced, compliance_history_paye_number,
//         compliance_history_income_tax_number, compliance_history_vat_number,
//         compliance_history_nis_number, owned_controlled, subsidiary_affiliate,
//         charitable_political, declaration_primary_name, declaration_primary_signature,
//         declaration_primary_position, declaration_primary_date,
//         declaration_secondary_name, declaration_secondary_signature,
//         declaration_secondary_position, declaration_secondary_date
//       ];

//       const result = await pool.query(query, values);
//       res.status(201).json(result.rows[0]);
//     } catch (err) {
//       console.error('Error creating registration:', err);
//       res.status(500).json({ error: 'Error creating registration' });
//     }
//   },

//   // Get all registrations
//   async getRegistrations(req, res) {
//     try {
//       const result = await pool.query('SELECT * FROM registrations ORDER BY created_at DESC');
//       res.json(result.rows);
//     } catch (err) {
//       console.error('Error getting registrations:', err);
//       res.status(500).json({ error: 'Error getting registrations' });
//     }
//   },

//   // Get registration by ID
//   async getRegistrationById(req, res) {
//     const { id } = req.params;
//     try {
//       const result = await pool.query('SELECT * FROM registrations WHERE id = $1', [id]);
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Registration not found' });
//       }
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error('Error getting registration:', err);
//       res.status(500).json({ error: 'Error getting registration' });
//     }
//   },

//   // Update registration
//   async updateRegistration(req, res) {
//     const { id } = req.params;
//     const {
//       business_name,
//       trading_name,
//       registration_type,
//       // ... (include all other fields from createRegistration)
//     } = req.body;

//     try {
//       const query = `
//         UPDATE registrations
//         SET business_name = $1, trading_name = $2, registration_type = $3
//         WHERE id = $4
//         RETURNING *;
//       `;

//       const values = [business_name, trading_name, registration_type, id];
//       const result = await pool.query(query, values);
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Registration not found' });
//       }
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error('Error updating registration:', err);
//       res.status(500).json({ error: 'Error updating registration' });
//     }
//   },

//   // Delete registration
//   async deleteRegistration(req, res) {
//     const { id } = req.params;
//     try {
//       const result = await pool.query('DELETE FROM registrations WHERE id = $1 RETURNING *', [id]);
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Registration not found' });
//       }
//       res.json({ message: 'Registration deleted successfully' });
//     } catch (err) {
//       console.error('Error deleting registration:', err);
//       res.status(500).json({ error: 'Error deleting registration' });
//     }
//   }
// };

// module.exports = registrationController;


const RegistrationModel = require('../models/registrationModel');

const registrationController = {
  async createRegistration(req, res) {
    try {
      const registration = await RegistrationModel.create(req.body);
      res.status(201).json(registration);
    } catch (err) {
      console.error('Error creating registration:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getRegistrations(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        business_name: req.query.business_name,
        registration_type: req.query.registration_type
      };
      const registrations = await RegistrationModel.findAll(page, limit, filters);
      res.json(registrations);
    } catch (err) {
      console.error('Error getting registrations:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getRegistrationById(req, res) {
    try {
      const registration = await RegistrationModel.findById(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      res.json(registration);
    } catch (err) {
      console.error('Error getting registration:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async updateRegistration(req, res) {
    try {
      const registration = await RegistrationModel.update(req.params.id, req.body);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      res.json(registration);
    } catch (err) {
      console.error('Error updating registration:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async deleteRegistration(req, res) {
    try {
      const registration = await RegistrationModel.delete(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      res.json({ message: 'Registration deleted successfully' });
    } catch (err) {
      console.error('Error deleting registration:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async searchRegistrations(req, res) {
    try {
      const registrations = await RegistrationModel.search(req.query.term);
      res.json(registrations);
    } catch (err) {
      console.error('Error searching registrations:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = registrationController;