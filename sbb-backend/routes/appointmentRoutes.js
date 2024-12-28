
// const express = require('express');
// const { createAppointment, getAppointments } = require('../controllers/appointmentController');

// const router = express.Router();

// router.post('/', createAppointment);
// router.get('/', getAppointments);

// module.exports = router;

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Appointment routes
router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/registration/:registration_id', appointmentController.getRegistrationAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;