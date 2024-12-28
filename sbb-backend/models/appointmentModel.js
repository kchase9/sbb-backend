
// const pool = require('../config/db');

// const createAppointment = async (registrationId, appointmentDate, status = 'Pending') => {
//   const result = await pool.query(
//     'INSERT INTO appointments (registration_id, appointment_date, status) VALUES ($1, $2, $3) RETURNING *',
//     [registrationId, appointmentDate, status]
//   );
//   return result.rows[0];
// };

// const getAllAppointments = async () => {
//   const result = await pool.query('SELECT * FROM appointments');
//   return result.rows;
// };

// module.exports = { createAppointment, getAllAppointments };
const pool = require('../config/db');

class AppointmentModel {
  // Create a new appointment
  static async create(appointmentData) {
    const {
      registration_id,
      appointment_date,
      status
    } = appointmentData;

    const query = `
      INSERT INTO appointments (
        registration_id,
        appointment_date,
        status
      )
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [
      registration_id,
      appointment_date,
      status || 'Pending'
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating appointment: ${error.message}`);
    }
  }

  // Get appointment by ID
  static async findById(id) {
    try {
      const query = `
        SELECT a.*, 
               r.business_name,
               r.primary_contact_name,
               r.primary_contact_phone,
               r.primary_contact_email
        FROM appointments a
        JOIN registrations r ON a.registration_id = r.id
        WHERE a.id = $1;
      `;
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding appointment: ${error.message}`);
    }
  }

  // Get all appointments with pagination and filters
  static async findAll(page = 1, limit = 10, filters = {}) {
    try {
      let query = `
        SELECT a.*, 
               r.business_name,
               r.primary_contact_name,
               r.primary_contact_phone,
               COUNT(*) OVER() as total_count
        FROM appointments a
        JOIN registrations r ON a.registration_id = r.id
        WHERE 1 = 1
      `;

      const values = [];
      let paramCount = 1;

      // Add filters
      if (filters.status) {
        query += ` AND a.status = $${paramCount}`;
        values.push(filters.status);
        paramCount++;
      }

      if (filters.date_from) {
        query += ` AND a.appointment_date >= $${paramCount}`;
        values.push(filters.date_from);
        paramCount++;
      }

      if (filters.date_to) {
        query += ` AND a.appointment_date <= $${paramCount}`;
        values.push(filters.date_to);
        paramCount++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` 
        ORDER BY a.appointment_date ASC 
        LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `;
      values.push(limit, offset);

      const { rows } = await pool.query(query, values);
      return {
        appointments: rows,
        total: rows.length > 0 ? parseInt(rows[0].total_count) : 0,
        page,
        limit
      };
    } catch (error) {
      throw new Error(`Error getting appointments: ${error.message}`);
    }
  }

  // Get appointments for a specific registration
  static async findByRegistrationId(registrationId) {
    try {
      const query = `
        SELECT *
        FROM appointments
        WHERE registration_id = $1
        ORDER BY appointment_date ASC;
      `;
      const { rows } = await pool.query(query, [registrationId]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting registration appointments: ${error.message}`);
    }
  }

  // Update appointment
  static async update(id, appointmentData) {
    const { appointment_date, status } = appointmentData;

    const query = `
      UPDATE appointments
      SET 
        appointment_date = COALESCE($1, appointment_date),
        status = COALESCE($2, status)
      WHERE id = $3
      RETURNING *;
    `;

    try {
      const { rows } = await pool.query(query, [appointment_date, status, id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error updating appointment: ${error.message}`);
    }
  }

  // Delete appointment
  static async delete(id) {
    try {
      const query = 'DELETE FROM appointments WHERE id = $1 RETURNING *';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error deleting appointment: ${error.message}`);
    }
  }

  // Get upcoming appointments
  static async getUpcoming(limit = 10) {
    try {
      const query = `
        SELECT a.*, 
               r.business_name,
               r.primary_contact_name,
               r.primary_contact_phone
        FROM appointments a
        JOIN registrations r ON a.registration_id = r.id
        WHERE a.appointment_date >= CURRENT_DATE
          AND a.status = 'Pending'
        ORDER BY a.appointment_date ASC
        LIMIT $1;
      `;
      const { rows } = await pool.query(query, [limit]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting upcoming appointments: ${error.message}`);
    }
  }

  // Get appointments by date range
  static async findByDateRange(startDate, endDate) {
    try {
      const query = `
        SELECT a.*, 
               r.business_name,
               r.primary_contact_name,
               r.primary_contact_phone
        FROM appointments a
        JOIN registrations r ON a.registration_id = r.id
        WHERE a.appointment_date BETWEEN $1 AND $2
        ORDER BY a.appointment_date ASC;
      `;
      const { rows } = await pool.query(query, [startDate, endDate]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting appointments by date range: ${error.message}`);
    }
  }
}

module.exports = AppointmentModel;
