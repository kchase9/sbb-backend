PLEASE NOTE, THE FORWARD TICKS (```) ARE THERE TO JUST DENOTE THAT THEY ARE COMMAND PROMPTS, DO NOT INCLUDE THEM IN THE COMMANDS, JUST TYPE THE WORDED PART IN THE SHELL OR COMMONLY KNOWN AS CMD. THE FOLLOWING EXPLAINS HOW TO CONNECT THE FRONTEND TO THE BACKEND. 

# Backend and Frontend Setup Instructions

## Overview
This project consists of a backend API built using **Node.js** and **PostgreSQL** following the **MVC (Model-View-Controller)** architecture, and a **React-based frontend**. The backend supports:
- User authentication (using JWT).
- Business registrations.
- Appointment scheduling.

The frontend is now connected to the backend and communicates via RESTful API endpoints. (Hope I did not miss anything. Really hope so...)

---

## Prerequisites
Before running this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or later)
- [PostgreSQL](https://www.postgresql.org/) (v13.x or later)
- A terminal (Command Prompt, PowerShell, or Bash)
- A text editor/IDE like Visual Studio Code (recommended)

---

## Backend Setup

### Step 1: Download the Backend
1. Download the provided backend ZIP file and extract it to a directory on your computer.
2. Alternatively, if you have Git installed, you can clone the repository:
   ```bash
   git clone <repository-url>
   ```

### Step 2: Navigate to the Backend Directory
Use a terminal to navigate into the backend folder:
```bash
cd backend_mvc_structure
```

### Step 3: Install Dependencies
Run the following command to install all required Node.js packages:
```bash
npm install
```

### Step 4: Configure the Environment Variables
Create a file named `.env` in the root of the backend directory. Add the following variables:
```env
DB_USER=your_database_user     # Your PostgreSQL username
DB_HOST=localhost              # PostgreSQL is running locally
DB_NAME=your_database_name     # Name of the database to connect to
DB_PASSWORD=your_database_password # Your PostgreSQL password
DB_PORT=5432                   # Default PostgreSQL port
JWT_SECRET=your_jwt_secret     # A random secret string for JWT
EMAIL_USER=your_email@example.com  # Email address for notifications
EMAIL_PASS=your_email_password # Email password for SMTP
```

### Step 5: Set Up PostgreSQL
1. Open PostgreSQL and create a new database:
   ```sql
   CREATE DATABASE your_database_name;
   ```
2. Make sure the database name matches the one in your `.env` file.

### Step 6: Run the Backend Application
Start the backend development server:
```bash
npm start
```

### Step 7: Access the Backend API
- The backend API will run on `http://localhost:5000` by default.
- API documentation is available at `http://localhost:5000/api-docs`.

---

## Frontend Setup

### Step 1: Download the Frontend
1. Use the frontend React project folder you provided earlier.
2. Ensure the folder is properly structured and dependencies are listed in the `package.json`.

### Step 2: Navigate to the Frontend Directory
Use a terminal to navigate into the React project folder:
```bash
cd <frontend-directory>
```

### Step 3: Install Dependencies
Run the following command to install all required Node.js packages:
```bash
npm install
```

### Step 4: Connect the Frontend to the Backend
1. Create a configuration file named `src/config.js` in your React project:
   ```javascript
   export const API_BASE_URL = "http://localhost:5000"; // Backend URL
   ```

2. Update your React components to fetch data from the backend API using `API_BASE_URL`. For example:
   - Fetch business registrations from the backend:
     ```javascript
     import axios from "axios";
     import { API_BASE_URL } from "./config";

     const fetchRegistrations = async () => {
         const response = await axios.get(`${API_BASE_URL}/api/registrations`);
         console.log(response.data); // Display fetched data
     };

     fetchRegistrations();
     ```

3. Add a proxy configuration in `package.json` to simplify API calls:
   ```json
   "proxy": "http://localhost:5000"
   ```

---

## Running the Frontend Application
Start the frontend development server:
```bash
npm start
```

Visit `http://localhost:3000` to access the React application in your browser.

---

## Notes for Users
1. **First-Time Setup**:
   - Running the backend for the first time will automatically create the required tables in the database.
   - Ensure the backend is running before testing the frontend.
2. **API Endpoints**:
   - All backend API endpoints are listed in the Swagger documentation at `http://localhost:5000/api-docs`.
3. **Authentication**:
   - Login tokens (JWT) are stored in the browser's `localStorage` for use in protected routes.

---

## Resources
- Swagger API Documentation: [Swagger Documentation](https://swagger.io/docs/specification/v2_0/what-is-swagger/)

---

## Support
If you encounter any issues:
- Ensure your environment variables are set correctly.
- Verify that both the backend and PostgreSQL servers are running.
- Confirm the frontend is pointing to the correct backend URL.


P.S. Too tired to rite comments so i asked chat to do it.

I f*#king hate JS i really hope I never have to use this stack again.

