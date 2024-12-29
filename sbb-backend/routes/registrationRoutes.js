
const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.get('/user/:user_id', registrationController.getRegistrationsByUserId);
// Registration routes
router.post('/', registrationController.createRegistration);
router.get('/', registrationController.getRegistrations);
router.get('/:id', registrationController.getRegistrationById);
router.put('/:id', registrationController.updateRegistration);
router.delete('/:id', registrationController.deleteRegistration);
router.patch('/:id/status', registrationController.updateStatus);

module.exports = router;