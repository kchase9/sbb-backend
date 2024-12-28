
// const express = require('express');
// const { registerUser, loginUser } = require('../controllers/userController');

// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);

// module.exports = router;
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // User routes
// router.post('/', userController.createUser);
// router.get('/', userController.getUsers);
// router.get('/:id', userController.getUserById);
// router.put('/:id', userController.updateUser);
// router.delete('/:id', userController.deleteUser);

// module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Auth routes (public)
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