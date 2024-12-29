

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin, signOut } = require('../middleware/authMiddleware');

// Add this new route
router.post('/signout', authenticateToken, signOut);
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, userController.getCurrentUser);
router.put('/profile', authenticateToken, userController.updateUser);

// Admin routes (require authentication and admin role)
router.get('/', authenticateToken, isAdmin, userController.getUsers);
router.get('/:id', authenticateToken, isAdmin, userController.getUserById);
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);

module.exports = router;