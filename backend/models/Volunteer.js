const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  specialty: {
    type: String,
    default: 'General Support'
  },
  city: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'busy'],
    default: 'available'
  },
  contact: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
