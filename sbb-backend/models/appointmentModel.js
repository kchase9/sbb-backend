
const pool = require('../config/db');

const createAppointment = async (registrationId, appointmentDate, status = 'Pending') => {
  const result = await pool.query(
    'INSERT INTO appointments (registration_id, appointment_date, status) VALUES ($1, $2, $3) RETURNING *',
    [registrationId, appointmentDate, status]
  );
  return result.rows[0];
};

const getAllAppointments = async () => {
  const result = await pool.query('SELECT * FROM appointments');
  return result.rows;
};

module.exports = { createAppointment, getAllAppointments };
