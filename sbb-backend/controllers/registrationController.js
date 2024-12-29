
const RegistrationModel = require('../models/registrationModel');


const registrationController = {
  async createRegistration(req, res) {
    try {
      const registration = await RegistrationModel.create(req.body);
      res.status(201).json(registration);
    } catch (err) {
      console.error('Error creating registration:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async updateStatus(req, res) {
      try {
          const { id } = req.params; // Extract registration ID from URL
          const { status } = req.body; // Extract status from request body

          if (!status) {
              return res.status(400).json({ error: 'Status is required' });
          }

          // Call the model to update the status
          const updatedRegistration = await RegistrationModel.updateStatus(id, status);

          if (!updatedRegistration) {
              return res.status(404).json({ error: 'Registration not found' });
          }

          res.json(updatedRegistration);
      } catch (error) {
          console.error('Error updating registration status:', error.message);
          res.status(500).json({ error: 'Failed to update registration status' });
      }
  },


  async getRegistrationsByUserId(req, res) {
    try {
      const { user_id } = req.params; // Assume user_id is passed as a URL parameter
      const registrations = await RegistrationModel.findByUserId(user_id);
      if (!registrations || registrations.length === 0) {
        return res.status(404).json({ error: 'No registrations found for this user' });
      }
      res.json(registrations);
    } catch (err) {
      console.error('Error getting registrations by user_id:', err);
      res.status(500).json({ error: err.message });
    }
  },
  

  async getRegistrations(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        business_name: req.query.business_name,
        registration_type: req.query.registration_type
      };
      const registrations = await RegistrationModel.findAll(page, limit, filters);
      res.json(registrations);
    } catch (err) {
      console.error('Error getting registrations:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async getRegistrationById(req, res) {
    try {
      const registration = await RegistrationModel.findById(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      res.json(registration);
    } catch (err) {
      console.error('Error getting registration:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async updateRegistration(req, res) {
    try {
      const registration = await RegistrationModel.update(req.params.id, req.body);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      res.json(registration);
    } catch (err) {
      console.error('Error updating registration:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async deleteRegistration(req, res) {
    try {
      const registration = await RegistrationModel.delete(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      res.json({ message: 'Registration deleted successfully' });
    } catch (err) {
      console.error('Error deleting registration:', err);
      res.status(500).json({ error: err.message });
    }
  },

  async searchRegistrations(req, res) {
    try {
      const registrations = await RegistrationModel.search(req.query.term);
      res.json(registrations);
    } catch (err) {
      console.error('Error searching registrations:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = registrationController;