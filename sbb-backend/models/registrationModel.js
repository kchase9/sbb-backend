
const pool = require('../config/db');

const createRegistration = async (businessName, ownerName, email, phone) => {
  const result = await pool.query(
    'INSERT INTO registrations (business_name, owner_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
    [businessName, ownerName, email, phone]
  );
  return result.rows[0];
};

const getAllRegistrations = async () => {
  const result = await pool.query('SELECT * FROM registrations');
  return result.rows;
};

module.exports = { createRegistration, getAllRegistrations };
