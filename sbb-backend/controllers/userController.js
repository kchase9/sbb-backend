const UserModel = require('../models/userModel');
const DocumentModel = require('../models/documentModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
  // Signup endpoint
  async signup(req, res) {
    try {
      // Create user
      const { user, token } = await UserModel.signup(req.body);

      // Initialize documents record for the user
      await DocumentModel.create(user.id);

      res.status(201).json({
        message: 'User registered successfully',
        user,
        token,
      });
    } catch (err) {
      console.error('Signup error:', err);
      if (err.message.includes('already exists')) {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Error during signup' });
    }
  },

  // Login endpoint
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { user, token } = await UserModel.login(email, password);
      res.json({
        message: 'Login successful',
        user,
        token,
      });
    } catch (err) {
      console.error('Login error:', err);
      if (err.message.includes('not found') || err.message.includes('Invalid password')) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.status(500).json({ error: 'Error during login' });
    }
  },

  // Get current user profile
  async getCurrentUser(req, res) {
    try {
      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (err) {
      console.error('Error getting current user:', err);
      res.status(500).json({ error: 'Error getting user profile' });
    }
  },

  // Create a new user (Admin-level endpoint)
  async createUser(req, res) {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const userData = {
        ...req.body,
        password: hashedPassword,
      };

      const user = await UserModel.create(userData);
      res.status(201).json(user);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Get all users with pagination
  async getUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const users = await UserModel.findAll(page, limit);
      res.json(users);
    } catch (err) {
      console.error('Error getting users:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error('Error getting user:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const user = await UserModel.update(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const user = await UserModel.delete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: err.message });
    }
  },

  // Change user password
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await UserModel.findById(req.user.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if old password matches
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid old password' });
      }

      // Hash new password and update
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.updatePassword(req.user.userId, hashedPassword);

      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error('Error changing password:', err);
      res.status(500).json({ error: 'Error changing password' });
    }
  },
};

module.exports = userController;
