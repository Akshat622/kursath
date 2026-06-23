const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'sub-admin', 'user'],
    default: 'user'
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  institution: {
    type: String,
    default: ''
  },
  classOrDegree: {
    type: String,
    default: ''
  },
  courseOrMajor: {
    type: String,
    default: ''
  },
  savedOpportunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity'
  }],
  notificationPreferences: {
    scholarships: {
      type: Boolean,
      default: true
    },
    hostels: {
      type: Boolean,
      default: true
    },
    schemes: {
      type: Boolean,
      default: true
    },
    livelihoods: {
      type: Boolean,
      default: true
    },
    careers: {
      type: Boolean,
      default: true
    }
  },
  permissions: {
    view: {
      type: Boolean,
      default: true
    },
    edit: {
      type: Boolean,
      default: false
    },
    delete: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

module.exports = mongoose.model('User', UserSchema);
