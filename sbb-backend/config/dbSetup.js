const pool = require('./db');

const createTables = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      full_name VARCHAR(255) NOT NULL,
      dob DATE NOT NULL,
      gender VARCHAR(50),
      marital_status VARCHAR(50),
      differently_abled BOOLEAN DEFAULT FALSE,
      education VARCHAR(50),
      id_number VARCHAR(50) UNIQUE,
      tin_number VARCHAR(50) UNIQUE,
      phone VARCHAR(20),
      address_line_1 VARCHAR(255),
      address_line_2 VARCHAR(255),
      address_line_3 VARCHAR(255),
      region VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    // Registrations table
    `CREATE TABLE IF NOT EXISTS registrations (
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      id SERIAL PRIMARY KEY,
      business_name VARCHAR(255) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      trading_name VARCHAR(255),
      registration_type VARCHAR(255),
      primary_contact_name VARCHAR(255) NOT NULL,
      primary_contact_phone VARCHAR(20) NOT NULL,
      primary_contact_email VARCHAR(255) NOT NULL,
      secondary_contact_name VARCHAR(255),
      secondary_contact_phone VARCHAR(20),
      secondary_contact_email VARCHAR(255),
      physical_address TEXT NOT NULL,
      trading_address TEXT,
      mailing_address TEXT,
      business_email VARCHAR(255) NOT NULL,
      business_website VARCHAR(255),
      business_phone VARCHAR(20) NOT NULL,
      primary_business_sector VARCHAR(255) NOT NULL,
      business_outline TEXT NOT NULL,
      industry_types VARCHAR(255),
      business_tin VARCHAR(50) NOT NULL,
      tin_registered_date DATE NOT NULL,
      business_vat VARCHAR(50),
      vat_registered_date DATE,
      business_nis VARCHAR(50) NOT NULL,
      nis_registered_date DATE NOT NULL,
      business_registration_location VARCHAR(255),
      date_business_commenced DATE,
      compliance_history_paye_number VARCHAR(50),
      compliance_history_income_tax_number VARCHAR(50),
      compliance_history_vat_number VARCHAR(50),
      compliance_history_nis_number VARCHAR(50),
      owned_controlled BOOLEAN DEFAULT FALSE,
      subsidiary_affiliate BOOLEAN DEFAULT FALSE,
      charitable_political BOOLEAN DEFAULT FALSE,
      declaration_primary_name VARCHAR(255) NOT NULL,
      declaration_primary_signature TEXT NOT NULL,
      declaration_primary_position VARCHAR(255) NOT NULL,
      declaration_primary_date DATE NOT NULL,
      declaration_secondary_name VARCHAR(255),
      declaration_secondary_signature TEXT,
      declaration_secondary_position VARCHAR(255),
      declaration_secondary_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS registration_review(
      id SERIAL PRIMARY KEY,
      registration_id INTEGER REFERENCES registrations(id) ON DELETE CASCADE,
      status VARCHAR(50),
      reviewer_comment VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    // Owners table
    `CREATE TABLE IF NOT EXISTS owners (
      id SERIAL PRIMARY KEY,
      registration_id INTEGER REFERENCES registrations(id) ON DELETE CASCADE,
      full_name VARCHAR(255) NOT NULL,
      marital_status VARCHAR(50),
      position_title VARCHAR(255),
      gender VARCHAR(50),
      tin VARCHAR(50),
      birthdate DATE,
      differently_abled BOOLEAN DEFAULT FALSE,
      id_number VARCHAR(50),
      education_level VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      user_email VARCHAR(255) NOT NULL,
      purpose TEXT NOT NULL,
      appointment_date TIMESTAMP NOT NULL,
      status VARCHAR(50) DEFAULT 'pending',
      processed_by INTEGER REFERENCES users(id),
      processed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,

  `CREATE TABLE IF NOT EXISTS appointment_employees (
      id SERIAL PRIMARY KEY,
      appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
      employee_name VARCHAR(255) NOT NULL,
      job_title VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
    // Documents table
    `CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      business_registration BOOLEAN DEFAULT FALSE,
      tin_certificate BOOLEAN DEFAULT FALSE,
      nis_certificate BOOLEAN DEFAULT FALSE,
      gra_compliance_letter BOOLEAN DEFAULT FALSE,
      nis_compliance_letter BOOLEAN DEFAULT FALSE,
      operational_license BOOLEAN DEFAULT FALSE,
      compliance_certificate BOOLEAN DEFAULT FALSE,
      owner_tin_certificate BOOLEAN DEFAULT FALSE,
      id_cards BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS document_store (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      document_type VARCHAR(255) NOT NULL,
      filename VARCHAR(255) NOT NULL,
      file_type VARCHAR(50),
      file_size BIGINT,
      file_data BYTEA,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS document_change_requests (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      document_type VARCHAR(255) NOT NULL,
      reason VARCHAR(255) NOT NULL,
      other_reason TEXT,
      status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
      new_document_id INTEGER REFERENCES document_store(id),
      requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      processed_at TIMESTAMP,
      processed_by INTEGER REFERENCES users(id)
  );`,
  ];

  try {
    for (const query of queries) {
      await pool.query(query);
    }
    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

module.exports = { createTables };
