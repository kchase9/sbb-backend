// const pool = require('../db');

// const ownerController = {
//   // Create a new owner
//   async createOwner(req, res) {
//     const {
//       registration_id,
//       full_name,
//       marital_status,
//       position_title,
//       gender,
//       tin,
//       birthdate,
//       differently_abled,
//       id_number,
//       education_level
//     } = req.body;

//     try {
//       const query = `
//         INSERT INTO owners (
//           registration_id,
//           full_name,
//           marital_status,
//           position_title,
//           gender,
//           tin,
//           birthdate,
//           differently_abled,
//           id_number,
//           education_level
//         )
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
//         RETURNING *;
//       `;

//       const values = [
//         registration_id,
//         full_name,
//         marital_status,
//         position_title,
//         gender,
//         tin,
//         birthdate,
//         differently_abled,
//         id_number,
//         education_level
//       ];

//       const result = await pool.query(query, values);
//       res.status(201).json(result.rows[0]);
//     } catch (err) {
//       console.error('Error creating owner:', err);
//       res.status(500).json({ error: 'Error creating owner' });
//     }
//   },

//   // Get all owners for a registration
//   async getRegistrationOwners(req, res) {
//     const { registration_id } = req.params;
//     try {
//       const query = `
//         SELECT *
//         FROM owners
//         WHERE registration_id = $1
//         ORDER BY created_at DESC;
//       `;
      
//       const result = await pool.query(query, [registration_id]);
//       res.json(result.rows);
//     } catch (err) {
//       console.error('Error getting registration owners:', err);
//       res.status(500).json({ error: 'Error getting registration owners' });
//     }
//   },

//   // Get owner by ID
//   async getOwnerById(req, res) {
//     const { id } = req.params;
//     try {
//       const query = `
//         SELECT o.*, r.business_name
//         FROM owners o
//         JOIN registrations r ON o.registration_id = r.id
//         WHERE o.id = $1;
//       `;
      
//       const result = await pool.query(query, [id]);
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Owner not found' });
//       }
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error('Error getting owner:', err);
//       res.status(500).json({ error: 'Error getting owner' });
//     }
//   },

//   // Update owner
//   async updateOwner(req, res) {
//     const { id } = req.params;
//     const {
//       full_name,
//       marital_status,
//       position_title,
//       gender,
//       tin,
//       birthdate,
//       differently_abled,
//       id_number,
//       education_level
//     } = req.body;

//     try {
//       const query = `
//         UPDATE owners
//         SET full_name = $1,
//             marital_status = $2,
//             position_title = $3,
//             gender = $4,
//             tin = $5,
//             birthdate = $6,
//             differently_abled = $7,
//             id_number = $8,
//             education_level = $9
//         WHERE id = $10
//         RETURNING *;
//       `;

//       const values = [
//         full_name,
//         marital_status,
//         position_title,
//         gender,
//         tin,
//         birthdate,
//         differently_abled,
//         id_number,
//         education_level,
//         id
//       ];

//       const result = await pool.query(query, values);
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Owner not found' });
//       }
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error('Error updating owner:', err);
//       res.status(500).json({ error: 'Error updating owner' });
//     }
//   },

//   // Delete owner
//   async deleteOwner(req, res) {
//     const { id } = req.params;
//     try {
//       const result = await pool.query('DELETE FROM owners WHERE id = $1 RETURNING *', [id]);
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Owner not found' });
//       }
//       res.json({ message: 'Owner deleted successfully' });
//     } catch (err) {
//       console.error('Error deleting owner:', err);
//       res.status(500).json({ error: 'Error deleting owner' });
//     }
//   }
// };

// module.exports = ownerController;


const OwnerModel = require('../models/ownerModel');

const ownerController = {
  async createOwner(req, res) {
    try {
      const owner = await OwnerModel.create(req.body);
      res.status(201).json(owner);
    } catch (err) {
      console.error('Error creating owner:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getRegistrationOwners(req, res) {
    try {
      const owners = await OwnerModel.findByRegistrationId(req.params.registration_id);
      res.json(owners);
    } catch (err) {
      console.error('Error getting registration owners:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getOwnerById(req, res) {
    try {
      const owner = await OwnerModel.findById(req.params.id);
      if (!owner) {
        return res.status(404).json({ error: 'Owner not found' });
      }
      res.json(owner);
    } catch (err) {
      console.error('Error getting owner:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async updateOwner(req, res) {
    try {
      const owner = await OwnerModel.update(req.params.id, req.body);
      if (!owner) {
        return res.status(404).json({ error: 'Owner not found' });
      }
      res.json(owner);
    } catch (err) {
      console.error('Error updating owner:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async deleteOwner(req, res) {
    try {
      const owner = await OwnerModel.delete(req.params.id);
      if (!owner) {
        return res.status(404).json({ error: 'Owner not found' });
      }
      res.json({ message: 'Owner deleted successfully' });
    } catch (err) {
      console.error('Error deleting owner:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async searchOwners(req, res) {
    try {
      const owners = await OwnerModel.search(req.query.term);
      res.json(owners);
    } catch (err) {
      console.error('Error searching owners:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getAllOwners(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const owners = await OwnerModel.findAll(page, limit);
      res.json(owners);
    } catch (err) {
      console.error('Error getting all owners:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getOwnerStatistics(req, res) {
    try {
      const statistics = await OwnerModel.getStatistics();
      res.json(statistics);
    } catch (err) {
      console.error('Error getting owner statistics:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ownerController;