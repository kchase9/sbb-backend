
const bcrypt = require('bcrypt'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for generating JSON Web Tokens
const { createUser, findUserByUsername } = require('../models/userModel'); // Import functions from the User model

// Controller to handle user registration
const registerUser = async (req, res) => {
  const { username, password, role } = req.body; // Extract data from the request body
  try {
    // Hash the user's password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user in the database
    const user = await createUser(username, hashedPassword, role);
    res.status(201).json(user); // Return the created user
  } catch (err) {
    console.error(err); // Log errors for debugging
    res.status(500).send('Error registering user'); // Send an error response to the client
  }
};

// Controller to handle user login
const loginUser = async (req, res) => {
  const { username, password } = req.body; // Extract credentials from the request body
  try {
    // Find the user in the database
    const user = await findUserByUsername(username);
    if (!user) return res.status(400).send('Invalid credentials'); // Return error if user not found

    // Compare provided password with stored hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials'); // Return error if password is incorrect

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.header('Authorization', token).send({ token }); // Send the token to the client
  } catch (err) {
    console.error(err); // Log errors for debugging
    res.status(500).send('Error logging in'); // Send an error response to the client
  }
};

module.exports = { registerUser, loginUser }; // Export the controllers for use in routes
