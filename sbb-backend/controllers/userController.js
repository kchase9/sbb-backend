
// // const bcrypt = require('bcrypt'); // Library for hashing passwords
// // const jwt = require('jsonwebtoken'); // Library for generating JSON Web Tokens
// // const { createUser, findUserByUsername } = require('../models/userModel'); // Import functions from the User model

// // // Controller to handle user registration
// // const registerUser = async (req, res) => {
// //   const { username, password, role } = req.body; // Extract data from the request body
// //   try {
// //     // Hash the user's password for security
// //     const salt = await bcrypt.genSalt(10);
// //     const hashedPassword = await bcrypt.hash(password, salt);

// //     // Save the user in the database
// //     const user = await createUser(username, hashedPassword, role);
// //     res.status(201).json(user); // Return the created user
// //   } catch (err) {
// //     console.error(err); // Log errors for debugging
// //     res.status(500).send('Error registering user'); // Send an error response to the client
// //   }
// // };

// // // Controller to handle user login
// // const loginUser = async (req, res) => {
// //   const { username, password } = req.body; // Extract credentials from the request body
// //   try {
// //     // Find the user in the database
// //     const user = await findUserByUsername(username);
// //     if (!user) return res.status(400).send('Invalid credentials'); // Return error if user not found

// //     // Compare provided password with stored hash
// //     const validPassword = await bcrypt.compare(password, user.password);
// //     if (!validPassword) return res.status(400).send('Invalid credentials'); // Return error if password is incorrect

// //     // Generate a JWT token for the authenticated user
// //     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
// //     res.header('Authorization', token).send({ token }); // Send the token to the client
// //   } catch (err) {
// //     console.error(err); // Log errors for debugging
// //     res.status(500).send('Error logging in'); // Send an error response to the client
// //   }
// // };

// // module.exports = { registerUser, loginUser }; // Export the controllers for use in routes

// // const pool = require('../config/db');

// // const bcrypt = require('bcryptjs');

// // const userController = {
// //   // Create a new user
// //   async createUser(req, res) {
// //     const {
// //       email,
// //       password,
// //       full_name,
// //       dob,
// //       gender,
// //       marital_status,
// //       differently_abled,
// //       education,
// //       id_number,
// //       tin_number,
// //       phone,
// //       address_line_1,
// //       address_line_2,
// //       address_line_3,
// //       region
// //     } = req.body;

// //     try {
// //       // Hash password
// //       const hashedPassword = await bcrypt.hash(password, 10);

// //       const query = `
// //         INSERT INTO users (
// //           email, password, full_name, dob, gender, marital_status,
// //           differently_abled, education, id_number, tin_number,
// //           phone, address_line_1, address_line_2, address_line_3, region
// //         )
// //         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
// //         RETURNING id, email, full_name;
// //       `;

// //       const values = [
// //         email, hashedPassword, full_name, dob, gender, marital_status,
// //         differently_abled, education, id_number, tin_number,
// //         phone, address_line_1, address_line_2, address_line_3, region
// //       ];

// //       const result = await pool.query(query, values);
// //       res.status(201).json(result.rows[0]);
// //     } catch (err) {
// //       console.error('Error creating user:', err);
// //       res.status(500).json({ error: 'Error creating user' });
// //     }
// //   },

// //   // Get all users
// //   async getUsers(req, res) {
// //     try {
// //       const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
// //       res.json(result.rows);
// //     } catch (err) {
// //       console.error('Error getting users:', err);
// //       res.status(500).json({ error: 'Error getting users' });
// //     }
// //   },

// //   // Get user by ID
// //   async getUserById(req, res) {
// //     const { id } = req.params;
// //     try {
// //       const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
// //       if (result.rows.length === 0) {
// //         return res.status(404).json({ error: 'User not found' });
// //       }
// //       res.json(result.rows[0]);
// //     } catch (err) {
// //       console.error('Error getting user:', err);
// //       res.status(500).json({ error: 'Error getting user' });
// //     }
// //   },

// //   // Update user
// //   async updateUser(req, res) {
// //     const { id } = req.params;
// //     const {
// //       email,
// //       full_name,
// //       dob,
// //       gender,
// //       marital_status,
// //       differently_abled,
// //       education,
// //       id_number,
// //       tin_number,
// //       phone,
// //       address_line_1,
// //       address_line_2,
// //       address_line_3,
// //       region
// //     } = req.body;

// //     try {
// //       const query = `
// //         UPDATE users
// //         SET email = $1, full_name = $2, dob = $3, gender = $4,
// //             marital_status = $5, differently_abled = $6, education = $7,
// //             id_number = $8, tin_number = $9, phone = $10,
// //             address_line_1 = $11, address_line_2 = $12, address_line_3 = $13,
// //             region = $14
// //         WHERE id = $15
// //         RETURNING *;
// //       `;

// //       const values = [
// //         email, full_name, dob, gender, marital_status,
// //         differently_abled, education, id_number, tin_number,
// //         phone, address_line_1, address_line_2, address_line_3,
// //         region, id
// //       ];

// //       const result = await pool.query(query, values);
// //       if (result.rows.length === 0) {
// //         return res.status(404).json({ error: 'User not found' });
// //       }
// //       res.json(result.rows[0]);
// //     } catch (err) {
// //       console.error('Error updating user:', err);
// //       res.status(500).json({ error: 'Error updating user' });
// //     }
// //   },

// //   // Delete user
// //   async deleteUser(req, res) {
// //     const { id } = req.params;
// //     try {
// //       const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
// //       if (result.rows.length === 0) {
// //         return res.status(404).json({ error: 'User not found' });
// //       }
// //       res.json({ message: 'User deleted successfully' });
// //     } catch (err) {
// //       console.error('Error deleting user:', err);
// //       res.status(500).json({ error: 'Error deleting user' });
// //     }
// //   }
// // };

// // module.exports = userController;


// const UserModel = require('../models/userModel');
// const bcrypt = require('bcryptjs');

// const userController = {
//   // Create a new user
//   async createUser(req, res) {
//     try {
//       // Hash password
//       const hashedPassword = await bcrypt.hash(req.body.password, 10);
//       const userData = {
//         ...req.body,
//         password: hashedPassword
//       };

//       const user = await UserModel.create(userData);
//       res.status(201).json(user);
//     } catch (err) {
//       console.error('Error creating user:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Get all users
//   async getUsers(req, res) {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const users = await UserModel.findAll(page, limit);
//       res.json(users);
//     } catch (err) {
//       console.error('Error getting users:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Get user by ID
//   async getUserById(req, res) {
//     try {
//       const user = await UserModel.findById(req.params.id);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//       res.json(user);
//     } catch (err) {
//       console.error('Error getting user:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Update user
//   async updateUser(req, res) {
//     try {
//       const user = await UserModel.update(req.params.id, req.body);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//       res.json(user);
//     } catch (err) {
//       console.error('Error updating user:', err);
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // Delete user
//   async deleteUser(req, res) {
//     try {
//       const user = await UserModel.delete(req.params.id);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
//       res.json({ message: 'User deleted successfully' });
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       res.status(500).json({ error: err.message });
//     }
//   }
// };

// module.exports = userController;


const UserModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
  // Signup endpoint
  async signup(req, res) {
    try {
      const { user, token } = await UserModel.signup(req.body);
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
