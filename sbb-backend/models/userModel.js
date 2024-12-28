
const pool = require('../config/db'); // Import the database connection pool

// Function to create a new user in the database
const createUser = async (username, hashedPassword, role) => {
  const result = await pool.query(
    'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
    [username, hashedPassword, role || 'user'] // Default role is 'user' if not provided
  );
  return result.rows[0]; // Return the newly created user record
};

// Function to find a user by their username
const findUserByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0]; // Return the first matching user or undefined if not found
};

module.exports = { createUser, findUserByUsername }; // Export the functions for use in controllers
