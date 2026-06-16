const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['scholarship', 'scheme', 'hostel', 'livelihood', 'admission', 'career', 'mentorship', 'casestudy']
  },
  type: {
    type: String,
    default: ''
  },
  deadline: {
    type: String,
    default: 'Open'
  },
  amount: {
    type: String,
    default: ''
  },
  eligibility: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
