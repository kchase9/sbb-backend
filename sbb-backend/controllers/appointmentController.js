
const pool = require('../config/db');

const createAppointment = async (req, res) => {
  const { registration_id, appointment_date, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO appointments (registration_id, appointment_date, status) VALUES ($1, $2, $3) RETURNING *',
      [registration_id, appointment_date, status || 'Pending']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating appointment');
  }
};

const getAppointments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching appointments');
  }
};

module.exports = { createAppointment, getAppointments };
