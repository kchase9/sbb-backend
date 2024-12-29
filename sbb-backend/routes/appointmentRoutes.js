
const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// User routes
router.post('/request', authenticateToken, appointmentController.createAppointment);

// Admin routes
router.get('/pending', authenticateToken, isAdmin, appointmentController.getPendingAppointments);
router.get('/:userId', authenticateToken, isAdmin, appointmentController.getUserAppointments);
router.get('/:id', authenticateToken, isAdmin, appointmentController.getIdAppointments);
router.get('/', authenticateToken, isAdmin, appointmentController.getAppointments);
router.post('/approve/:appointmentId', authenticateToken, isAdmin, appointmentController.approveStatus);
router.delete('/reject/:id', authenticateToken, isAdmin, appointmentController.rejectAppointment);

module.exports = router;