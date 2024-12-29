
// // const pool = require('../config/db');

// // const createAppointment = async (req, res) => {
// //   const { registration_id, appointment_date, status } = req.body;
// //   try {
// //     const result = await pool.query(
// //       'INSERT INTO appointments (registration_id, appointment_date, status) VALUES ($1, $2, $3) RETURNING *',
// //       [registration_id, appointment_date, status || 'Pending']
// //     );
// //     res.status(201).json(result.rows[0]);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send('Error creating appointment');
// //   }
// // };

// // const getAppointments = async (req, res) => {
// //   try {
// //     const result = await pool.query('SELECT * FROM appointments');
// //     res.status(200).json(result.rows);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send('Error fetching appointments');
// //   }
// // };

// // // module.exports = { createAppointment, getAppointments };
// // const pool = require('../config/db');

// // const appointmentController = {
// //   // Create a new appointment
// //   async createAppointment(req, res) {
// //     const { registration_id, appointment_date, status } = req.body;

// //     try {
// //       const query = `
// //         INSERT INTO appointments (registration_id, appointment_date, status)
// //         VALUES ($1, $2, $3)
// //         RETURNING *;
// //       `;

// //       const values = [registration_id, appointment_date, status || 'Pending'];
// //       const result = await pool.query(query, values);
// //       res.status(201).json(result.rows[0]);
// //     } catch (err) {
// //       console.error('Error creating appointment:', err);
// //       res.status(500).json({ error: 'Error creating appointment' });
// //     }
// //   },

// //   // Get all appointments
// //   async getAppointments(req, res) {
// //     try {
// //       const query = `
// //         SELECT a.*, r.business_name, r.primary_contact_name, r.primary_contact_phone
// //         FROM appointments a
// //         JOIN registrations r ON a.registration_id = r.id
// //         ORDER BY a.appointment_date DESC;
// //       `;
      
// //       const result = await pool.query(query);
// //       res.json(result.rows);
// //     } catch (err) {
// //       console.error('Error getting appointments:', err);
// //       res.status(500).json({ error: 'Error getting appointments' });
// //     }
// //   },

// //   // Get appointments for a specific registration
// //   async getRegistrationAppointments(req, res) {
// //     const { registration_id } = req.params;
// //     try {
// //       const query = `
// //         SELECT *
// //         FROM appointments
// //         WHERE registration_id = $1
// //         ORDER BY appointment_date DESC;
// //       `;
      
// //       const result = await pool.query(query, [registration_id]);
// //       res.json(result.rows);
// //     } catch (err) {
// //       console.error('Error getting registration appointments:', err);
// //       res.status(500).json({ error: 'Error getting registration appointments' });
// //     }
// //   },

// //   // Get appointment by ID
// //   async getAppointmentById(req, res) {
// //     const { id } = req.params;
// //     try {
// //       const query = `
// //         SELECT a.*, r.business_name, r.primary_contact_name, r.primary_contact_phone
// //         FROM appointments a
// //         JOIN registrations r ON a.registration_id = r.id
// //         WHERE a.id = $1;
// //       `;
      
// //       const result = await pool.query(query, [id]);
// //       if (result.rows.length === 0) {
// //         return res.status(404).json({ error: 'Appointment not found' });
// //       }
// //       res.json(result.rows[0]);
// //     } catch (err) {
// //       console.error('Error getting appointment:', err);
// //       res.status(500).json({ error: 'Error getting appointment' });
// //     }
// //   },

// //   // Update appointment
// //   async updateAppointment(req, res) {
// //     const { id } = req.params;
// //     const { appointment_date, status } = req.body;

// //     try {
// //       const query = `
// //         UPDATE appointments
// //         SET appointment_date = $1, status = $2
// //         WHERE id = $3
// //         RETURNING *;
// //       `;

// //       const result = await pool.query(query, [appointment_date, status, id]);
// //       if (result.rows.length === 0) {
// //         return res.status(404).json({ error: 'Appointment not found' });
// //       }
// //       res.json(result.rows[0]);
// //     } catch (err) {
// //       console.error('Error updating appointment:', err);
// //       res.status(500).json({ error: 'Error updating appointment' });
// //     }
// //   },

// //   // Delete appointment
// //   async deleteAppointment(req, res) {
// //     const { id } = req.params;
// //     try {
// //       const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);
// //       if (result.rows.length === 0) {
// //         return res.status(404).json({ error: 'Appointment not found' });
// //       }
// //       res.json({ message: 'Appointment deleted successfully' });
// //     } catch (err) {
// //       console.error('Error deleting appointment:', err);
// //       res.status(500).json({ error: 'Error deleting appointment' });
// //     }
// //   }
// // };

// // module.exports = appointmentController;


// const AppointmentModel = require('../models/appointmentModel');

// const appointmentController = {
//   async createAppointment(req, res) {
//     try {
//       const appointment = await AppointmentModel.create(req.body);
//       res.status(201).json(appointment);
//     } catch (err) {
//       console.error('Error creating appointment:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   async getAppointments(req, res) {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const filters = {
//         status: req.query.status,
//         date_from: req.query.date_from,
//         date_to: req.query.date_to
//       };
//       const appointments = await AppointmentModel.findAll(page, limit, filters);
//       res.json(appointments);
//     } catch (err) {
//       console.error('Error getting appointments:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   async getRegistrationAppointments(req, res) {
//     try {
//       const appointments = await AppointmentModel.findByRegistrationId(req.params.registration_id);
//       res.json(appointments);
//     } catch (err) {
//       console.error('Error getting registration appointments:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   async getAppointmentById(req, res) {
//     try {
//       const appointment = await AppointmentModel.findById(req.params.id);
//       if (!appointment) {
//         return res.status(404).json({ error: 'Appointment not found' });
//       }
//       res.json(appointment);
//     } catch (err) {
//       console.error('Error getting appointment:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   async updateAppointment(req, res) {
//     try {
//       const appointment = await AppointmentModel.update(req.params.id, req.body);
//       if (!appointment) {
//         return res.status(404).json({ error: 'Appointment not found' });
//       }
//       res.json(appointment);
//     } catch (err) {
//       console.error('Error updating appointment:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   async deleteAppointment(req, res) {
//     try {
//       const appointment = await AppointmentModel.delete(req.params.id);
//       if (!appointment) {
//         return res.status(404).json({ error: 'Appointment not found' });
//       }
//       res.json({ message: 'Appointment deleted successfully' });
//     } catch (err) {
//       console.error('Error deleting appointment:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   async getUpcomingAppointments(req, res) {
//     try {
//       const limit = parseInt(req.query.limit) || 10;
//       const appointments = await AppointmentModel.getUpcoming(limit);
//       res.json(appointments);
//     } catch (err) {
//       console.error('Error getting upcoming appointments:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   async getAppointmentsByDateRange(req, res) {
//     try {
//       const { start_date, end_date } = req.query;
//       const appointments = await AppointmentModel.findByDateRange(start_date, end_date);
//       res.json(appointments);
//     } catch (err) {
//       console.error('Error getting appointments by date range:', err);
//       res.status(500).json({ error: err.message });
//     }
//   }
// };

// module.exports = appointmentController;

// controllers/appointmentController.js
const AppointmentModel = require('../models/appointmentModel');

const appointmentController = {
    createAppointment: async (req, res) => {
        try {
            const appointmentData = {
                userId: req.body.userId,
                userEmail: req.body.userEmail,
                purpose: req.body.purpose,
                appointmentDate: req.body.appointmentDate,
                employees: req.body.employees
            };

            const appointment = await AppointmentModel.create(appointmentData);

            res.status(201).json({
                message: 'Appointment request submitted successfully',
                appointment
            });
        } catch (err) {
            console.error('Error creating appointment:', err);
            res.status(500).json({ error: 'Error submitting appointment request' });
        }
    },

    getUserAppointments: async (req, res) => {
        try {
            const appointments = await AppointmentModel.findByUserId(req.params.userId);
            res.json(appointments);
        } catch (err) {
            console.error('Error getting appointments:', err);
            res.status(500).json({ error: 'Error retrieving appointments' });
        }
    },

    getPendingAppointments: async (req, res) => {
        try {
            const appointments = await AppointmentModel.findPending();
            res.json(appointments);
        } catch (err) {
            console.error('Error getting pending appointments:', err);
            res.status(500).json({ error: 'Error retrieving pending appointments' });
        }
    },

    approveAppointment: async (req, res) => {
        try {
            const appointment = await AppointmentModel.updateStatus(
                req.params.appointmentId,
                'approved',
                req.user.id
            );
            res.json({
                message: 'Appointment approved successfully',
                appointment
            });
        } catch (err) {
            console.error('Error approving appointment:', err);
            res.status(500).json({ error: 'Error approving appointment' });
        }
    },

    rejectAppointment: async (req, res) => {
        try {
            const appointment = await AppointmentModel.updateStatus(
                req.params.appointmentId,
                'rejected',
                req.user.id
            );
            res.json({
                message: 'Appointment rejected successfully',
                appointment
            });
        } catch (err) {
            console.error('Error rejecting appointment:', err);
            res.status(500).json({ error: 'Error rejecting appointment' });
        }
    }
};

module.exports = appointmentController;