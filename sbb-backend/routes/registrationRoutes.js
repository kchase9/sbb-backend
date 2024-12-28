
// const express = require('express');
// const { createRegistration, getRegistrations } = require('../controllers/registrationController');

// const router = express.Router();

// router.post('/', createRegistration);
// router.get('/', getRegistrations);

// module.exports = router;
const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// Registration routes
router.post('/', registrationController.createRegistration);
router.get('/', registrationController.getRegistrations);
router.get('/:id', registrationController.getRegistrationById);
router.put('/:id', registrationController.updateRegistration);
router.delete('/:id', registrationController.deleteRegistration);

module.exports = router;