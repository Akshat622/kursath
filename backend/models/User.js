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
