
// // const pool = require('../config/db'); // Import the database connection pool

// // // Function to create a new user in the database
// // const createUser = async (username, hashedPassword, role) => {
// //   const result = await pool.query(
// //     'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
// //     [username, hashedPassword, role || 'user'] // Default role is 'user' if not provided
// //   );
// //   return result.rows[0]; // Return the newly created user record
// // };

// // // Function to find a user by their username
// // const findUserByUsername = async (username) => {
// //   const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
// //   return result.rows[0]; // Return the first matching user or undefined if not found
// // };

// // module.exports = { createUser, findUserByUsername }; // Export the functions for use in controllers


// const pool = require('../config/db');

// class UserModel {
//   // Create a new user
//   static async create(userData) {
//     const {
//       email,
//       password,
//       role,
//       full_name,
//       dob,
//       gender,
//       marital_status,
//       differently_abled,
//       education,
//       id_number,
//       tin_number,
//       phone,
//       address_line_1,
//       address_line_2,
//       address_line_3,
//       region
//     } = userData;

//     const query = `
//       INSERT INTO users (
//         email, password, role, full_name, dob, gender,
//         marital_status, differently_abled, education,
//         id_number, tin_number, phone, address_line_1,
//         address_line_2, address_line_3, region
//       )
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
//       RETURNING *;
//     `;

//     const values = [
//       email,
//       password,
//       role || 'user',
//       full_name,
//       dob,
//       gender,
//       marital_status,
//       differently_abled,
//       education,
//       id_number,
//       tin_number,
//       phone,
//       address_line_1,
//       address_line_2,
//       address_line_3,
//       region
//     ];

//     try {
//       const { rows } = await pool.query(query, values);
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error creating user: ${error.message}`);
//     }
//   }
  

//   // Find user by ID
//   static async findById(id) {
//     try {
//       const query = 'SELECT * FROM users WHERE id = $1';
//       const { rows } = await pool.query(query, [id]);
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error finding user: ${error.message}`);
//     }
//   }

//   // Find user by email
//   static async findByEmail(email) {
//     try {
//       const query = 'SELECT * FROM users WHERE email = $1';
//       const { rows } = await pool.query(query, [email]);
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error finding user by email: ${error.message}`);
//     }
//   }

//   // Update user
//   static async update(id, userData) {
//     const {
//       email,
//       full_name,
//       dob,
//       gender,
//       marital_status,
//       differently_abled,
//       education,
//       id_number,
//       tin_number,
//       phone,
//       address_line_1,
//       address_line_2,
//       address_line_3,
//       region
//     } = userData;

//     const query = `
//       UPDATE users
//       SET email = $1,
//           full_name = $2,
//           dob = $3,
//           gender = $4,
//           marital_status = $5,
//           differently_abled = $6,
//           education = $7,
//           id_number = $8,
//           tin_number = $9,
//           phone = $10,
//           address_line_1 = $11,
//           address_line_2 = $12,
//           address_line_3 = $13,
//           region = $14,
//           updated_at = CURRENT_TIMESTAMP
//       WHERE id = $15
//       RETURNING *;
//     `;

//     const values = [
//       email,
//       full_name,
//       dob,
//       gender,
//       marital_status,
//       differently_abled,
//       education,
//       id_number,
//       tin_number,
//       phone,
//       address_line_1,
//       address_line_2,
//       address_line_3,
//       region,
//       id
//     ];

//     try {
//       const { rows } = await pool.query(query, values);
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error updating user: ${error.message}`);
//     }
//   }

//   // Delete user
//   static async delete(id) {
//     try {
//       const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
//       const { rows } = await pool.query(query, [id]);
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error deleting user: ${error.message}`);
//     }
//   }

//   // Get all users with optional pagination
//   static async findAll(page = 1, limit = 10) {
//     try {
//       const offset = (page - 1) * limit;
//       const query = `
//         SELECT * FROM users
//         ORDER BY created_at DESC
//         LIMIT $1 OFFSET $2;
//       `;
//       const { rows } = await pool.query(query, [limit, offset]);
//       return rows;
//     } catch (error) {
//       throw new Error(`Error getting users: ${error.message}`);
//     }
//   }

//   // Count total users
//   static async count() {
//     try {
//       const query = 'SELECT COUNT(*) FROM users';
//       const { rows } = await pool.query(query);
//       return parseInt(rows[0].count);
//     } catch (error) {
//       throw new Error(`Error counting users: ${error.message}`);
//     }
//   }

//   // Change password
//   static async updatePassword(id, hashedPassword) {
//     try {
//       const query = `
//         UPDATE users
//         SET password = $1,
//             updated_at = CURRENT_TIMESTAMP
//         WHERE id = $2
//         RETURNING id;
//       `;
//       const { rows } = await pool.query(query, [hashedPassword, id]);
//       return rows[0];
//     } catch (error) {
//       throw new Error(`Error updating password: ${error.message}`);
//     }
//   }
// }

// module.exports = UserModel;



const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserModel {
  // Signup method
  static async signup(userData) {
    const {
      email,
      password,
      full_name,
      dob,
      gender,
      marital_status,
      differently_abled,
      education,
      id_number,
      tin_number,
      phone,
      address_line_1,
      address_line_2,
      address_line_3,
      region
    } = userData;

    try {
      // Check if user already exists
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users (
          email, password, full_name, dob, gender,
          marital_status, differently_abled, education,
          id_number, tin_number, phone, address_line_1,
          address_line_2, address_line_3, region, role
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING id, email, full_name, role;
      `;

      const values = [
        email,
        hashedPassword,
        full_name,
        dob,
        gender,
        marital_status,
        differently_abled,
        education,
        id_number,
        tin_number,
        phone,
        address_line_1,
        address_line_2,
        address_line_3,
        region,
        'user' // default role
      ];

      const { rows } = await pool.query(query, values);
      const user = rows[0];

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        },
        token
      };
    } catch (error) {
      throw new Error(`Error in signup: ${error.message}`);
    }
  }

  // Login method
  static async login(email, password) {
    try {
      // Find user by email
      const user = await this.findByEmail(email);

      if (!user) {
        throw new Error('User not found');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return user data without sensitive information
      return {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        },
        token
      };
    } catch (error) {
      throw new Error(`Error in login: ${error.message}`);
    }
  }

  // Verify token method
  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.findById(decoded.userId);

      if (!user) {
        throw new Error('User not found');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  // Create a new user
  static async create(userData) {
    const {
      email,
      password,
      role,
      full_name,
      dob,
      gender,
      marital_status,
      differently_abled,
      education,
      id_number,
      tin_number,
      phone,
      address_line_1,
      address_line_2,
      address_line_3,
      region
    } = userData;

    const query = `
      INSERT INTO users (
        email, password, role, full_name, dob, gender,
        marital_status, differently_abled, education,
        id_number, tin_number, phone, address_line_1,
        address_line_2, address_line_3, region
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;

    const values = [
      email,
      password,
      role || 'user',
      full_name,
      dob,
      gender,
      marital_status,
      differently_abled,
      education,
      id_number,
      tin_number,
      phone,
      address_line_1,
      address_line_2,
      address_line_3,
      region
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const { rows } = await pool.query(query, [email]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  // Update user
  static async update(id, userData) {
    const {
      email,
      full_name,
      dob,
      gender,
      marital_status,
      differently_abled,
      education,
      id_number,
      tin_number,
      phone,
      address_line_1,
      address_line_2,
      address_line_3,
      region
    } = userData;

    const query = `
      UPDATE users
      SET email = $1,
          full_name = $2,
          dob = $3,
          gender = $4,
          marital_status = $5,
          differently_abled = $6,
          education = $7,
          id_number = $8,
          tin_number = $9,
          phone = $10,
          address_line_1 = $11,
          address_line_2 = $12,
          address_line_3 = $13,
          region = $14,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $15
      RETURNING *;
    `;

    const values = [
      email,
      full_name,
      dob,
      gender,
      marital_status,
      differently_abled,
      education,
      id_number,
      tin_number,
      phone,
      address_line_1,
      address_line_2,
      address_line_3,
      region,
      id
    ];

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  // Delete user
  static async delete(id) {
    try {
      const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  // Get all users with optional pagination
  static async findAll(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const query = `
        SELECT * FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2;
      `;
      const { rows } = await pool.query(query, [limit, offset]);
      return rows;
    } catch (error) {
      throw new Error(`Error getting users: ${error.message}`);
    }
  }

  // Count total users
  static async count() {
    try {
      const query = 'SELECT COUNT(*) FROM users';
      const { rows } = await pool.query(query);
      return parseInt(rows[0].count);
    } catch (error) {
      throw new Error(`Error counting users: ${error.message}`);
    }
  }

  // Change password
  static async updatePassword(id, hashedPassword) {
    try {
      const query = `
        UPDATE users
        SET password = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id;
      `;
      const { rows } = await pool.query(query, [hashedPassword, id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error updating password: ${error.message}`);
    }
  }
}

module.exports = UserModel;
