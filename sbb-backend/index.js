// const express = require('express');
// const pool = require('./config/db'); // Import pg Pool instance
// const dotenv = require('dotenv');
// const cors = require('cors');

// // Load environment variables from .env file
// dotenv.config();

// // Import routes
// const registrationRoutes = require('./routes/registrationRoutes');
// const appointmentRoutes = require('./routes/appointmentRoutes'); // Ensure the file exists
// const userRoutes = require('./routes/userRoutes');

// // Initialize express app
// const app = express();

// // Middleware
// app.use(cors()); // Enable Cross-Origin Resource Sharing
// app.use(express.json()); // Parse incoming JSON requests

// // API Routes
// app.use('/api/registrations', registrationRoutes);
// app.use('/api/appointments', appointmentRoutes); // Ensure the route file exists
// app.use('/api/users', userRoutes);

// // Default route for health check
// app.get('/', (req, res) => {
//     res.send('Backend server is running!');
// });

// // Start the server
// const PORT = process.env.PORT || 5000;

// pool.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//     } else {
//         console.log('Connected to the database');
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     }
// });


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config/db'); // Sequelize instance
const { createTables } = require('./config/dbSetup'); // Import createTables function

// Load environment variables from .env file
dotenv.config();

// Import routes
const registrationRoutes = require('./routes/registrationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/registrations', registrationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);

// Default route for health check
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// Start the server and sync database
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Create tables
        await createTables();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error starting the server:', err);
    }
};

startServer();
