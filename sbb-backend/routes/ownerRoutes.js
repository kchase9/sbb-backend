const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');

// Owner routes
router.post('/', ownerController.createOwner);
router.get('/registration/:registration_id', ownerController.getRegistrationOwners);
router.get('/:id', ownerController.getOwnerById);
router.put('/:id', ownerController.updateOwner);
router.delete('/:id', ownerController.deleteOwner);

module.exports = router;