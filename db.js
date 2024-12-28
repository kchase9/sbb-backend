const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a Sequelize instance with your database credentials
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432, // Default PostgreSQL port
    dialect: 'postgres',
    logging: false, // Disable logging; set to true or a function for debugging
});

module.exports = sequelize;
