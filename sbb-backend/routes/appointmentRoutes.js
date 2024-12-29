
// // const express = require('express');
// // const { createAppointment, getAppointments } = require('../controllers/appointmentController');

// // const router = express.Router();

// // router.post('/', createAppointment);
// // router.get('/', getAppointments);

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const appointmentController = require('../controllers/appointmentController');

// // Appointment routes
// router.post('/', appointmentController.createAppointment);
// router.get('/', appointmentController.getAppointments);
// router.get('/registration/:registration_id', appointmentController.getRegistrationAppointments);
// router.get('/:id', appointmentController.getAppointmentById);
// router.put('/:id', appointmentController.updateAppointment);
// router.delete('/:id', appointmentController.deleteAppointment);

// module.exports = router;

// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// User routes
router.post('/request', authenticateToken, appointmentController.createAppointment);
router.get('/user/:userId', authenticateToken, appointmentController.getUserAppointments);

// Admin routes
router.get('/pending', authenticateToken, isAdmin, appointmentController.getPendingAppointments);
router.post('/approve/:appointmentId', authenticateToken, isAdmin, appointmentController.approveAppointment);
router.post('/reject/:appointmentId', authenticateToken, isAdmin, appointmentController.rejectAppointment);

module.exports = router;