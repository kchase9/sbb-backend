
const pool = require('../config/db');

const createRegistration = async (req, res) => {
  const { business_name, owner_name, email, phone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO registrations (business_name, owner_name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [business_name, owner_name, email, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating registration');
  }
};

const getRegistrations = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM registrations');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching registrations');
  }
};

module.exports = { createRegistration, getRegistrations };
