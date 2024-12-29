
// // const express = require('express');
// // const dotenv = require('dotenv');
// // const cors = require('cors');
// // const sequelize = require('./config/db'); // Sequelize instance
// // const { createTables } = require('./config/dbSetup'); // Import createTables function

// // // Load environment variables from .env file
// // dotenv.config();

// // // Import routes
// // const registrationRoutes = require('./routes/registrationRoutes');
// // const appointmentRoutes = require('./routes/appointmentRoutes');
// // const userRoutes = require('./routes/userRoutes');
// // const documentRoutes = require('./routes/documentRoutes');
// // // Initialize express app
// // const app = express();

// // // Middleware
// // app.use(cors());
// // app.use(express.json());

// // // API Routes

// // app.use('/api/documents', documentRoutes);

// // app.use('/api/registrations', registrationRoutes);
// // app.use('/api/appointments', appointmentRoutes);
// // app.use('/api/users', userRoutes);

// // // Default route for health check
// // app.get('/', (req, res) => {
// //     res.send('Backend server is running!');
// // });

// // // Start the server and sync database
// // const PORT = process.env.PORT || 5000;

// // const startServer = async () => {
// //     try {
// //         // Create tables
// //         await createTables();

// //         // Start server
// //         app.listen(PORT, () => {
// //             console.log(`Server is running on port ${PORT}`);
// //         });
// //     } catch (err) {
// //         console.error('Error starting the server:', err);
// //     }
// // };

// // startServer();

// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const { createTables } = require('./config/dbSetup');

// // Load environment variables from .env file
// dotenv.config();

// // Import routes
// const userRoutes = require('./routes/userRoutes');
// const registrationRoutes = require('./routes/registrationRoutes');
// const documentRoutes = require('./routes/documentRoutes');
// const appointmentRoutes = require('./routes/appointmentRoutes');
// const ownerRoutes = require('./routes/ownerRoutes');

// // Initialize express app
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use('/api/users', userRoutes);
// app.use('/api/registrations', registrationRoutes);
// app.use('/api/documents', documentRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/owners', ownerRoutes);

// // Default route for health check
// app.get('/', (req, res) => {
//     res.send('Backend server is running!');
// });

// // Start the server and sync database
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//     try {
//         // Create tables
//         await createTables();

//         // Start server
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     } catch (err) {
//         console.error('Error starting the server:', err);
//     }
// };

// startServer();


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createTables } = require('./config/dbSetup');

// Load environment variables from .env file
dotenv.config();

// Import routes
const registrationRoutes = require('./routes/registrationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const userRoutes = require('./routes/userRoutes');
const documentRoutes = require('./routes/documentRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const documentStoreRoutes = require('./routes/documentStoreRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
app.use(express.json({ limit: '50mb' })); // Increased limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something broke!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// API Routes
app.use('/api/document-store', documentStoreRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/owners', ownerRoutes);

// Default route for health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend server is running!',
        version: '1.0.0',
        status: 'healthy'
    });
});

// Handle 404 routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
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
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (err) {
        console.error('Error starting the server:', err);
        process.exit(1);
    }
};

startServer();