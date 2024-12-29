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

    getIdAppointments: async (req, res) => {
        try {
            const appointments = await AppointmentModel.findById(req.params.id);
            res.json(appointments);
        } catch (err) {
            console.error('Error getting appointments:', err);
            res.status(500).json({ error: 'Error retrieving appointments' });
        }
    },

    getAppointments: async (req, res) => {
        try {
            const appointments = await AppointmentModel.findAll();
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

    approveStatus: async (req, res) => {
        try {
            const appointment = await AppointmentModel.updateStatus(
                req.params.appointmentId,
                'approved',
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
            const appointment = await AppointmentModel.delete(
                req.params.id,
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