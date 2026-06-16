const fs = require('fs');
const path = require('path');
const { getFallbackStatus } = require('./db');

// Import mongoose models
const Opportunity = require('../models/Opportunity');
const Volunteer = require('../models/Volunteer');
const Message = require('../models/Message');
const User = require('../models/User');

const fallbackFilePath = path.join(__dirname, '..', 'data_fallback.json');

// Read JSON fallback file
const readJSON = () => {
  try {
    const data = fs.readFileSync(fallbackFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading JSON fallback:', err);
    return { opportunities: [], volunteers: [], messages: [], users: [] };
  }
};

// Write JSON fallback file
const writeJSON = (data) => {
  try {
    fs.writeFileSync(fallbackFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing JSON fallback:', err);
  }
};

// Opportunities CRUD
const getOpportunities = async (query = {}) => {
  if (!getFallbackStatus()) {
    return await Opportunity.find(query).sort({ createdAt: -1 });
  } else {
    const data = readJSON();
    let list = data.opportunities || [];
    
    // Apply basic filtering if query is provided
    if (query.category) {
      list = list.filter(item => item.category === query.category);
    }
    return list;
  }
};

const createOpportunity = async (oppData) => {
  if (!getFallbackStatus()) {
    const opp = new Opportunity(oppData);
    return await opp.save();
  } else {
    const data = readJSON();
    const newOpp = {
      _id: Date.now().toString(),
      ...oppData,
      createdAt: new Date().toISOString()
    };
    data.opportunities.unshift(newOpp);
    writeJSON(data);
    return newOpp;
  }
};

const updateOpportunity = async (id, oppData) => {
  if (!getFallbackStatus()) {
    return await Opportunity.findByIdAndUpdate(id, oppData, { new: true });
  } else {
    const data = readJSON();
    const index = data.opportunities.findIndex(item => item._id === id);
    if (index !== -1) {
      data.opportunities[index] = { ...data.opportunities[index], ...oppData };
      writeJSON(data);
      return data.opportunities[index];
    }
    return null;
  }
};

const deleteOpportunity = async (id) => {
  if (!getFallbackStatus()) {
    return await Opportunity.findByIdAndDelete(id);
  } else {
    const data = readJSON();
    const index = data.opportunities.findIndex(item => item._id === id);
    if (index !== -1) {
      const deleted = data.opportunities.splice(index, 1)[0];
      writeJSON(data);
      return deleted;
    }
    return null;
  }
};

// Volunteers CRUD
const getVolunteers = async () => {
  if (!getFallbackStatus()) {
    return await Volunteer.find().sort({ createdAt: -1 });
  } else {
    const data = readJSON();
    return data.volunteers || [];
  }
};

const createVolunteer = async (volData) => {
  if (!getFallbackStatus()) {
    const vol = new Volunteer(volData);
    return await vol.save();
  } else {
    const data = readJSON();
    const newVol = {
      _id: Date.now().toString(),
      ...volData,
      createdAt: new Date().toISOString()
    };
    data.volunteers.unshift(newVol);
    writeJSON(data);
    return newVol;
  }
};

const updateVolunteer = async (id, volData) => {
  if (!getFallbackStatus()) {
    return await Volunteer.findByIdAndUpdate(id, volData, { new: true });
  } else {
    const data = readJSON();
    const index = data.volunteers.findIndex(item => item._id === id);
    if (index !== -1) {
      data.volunteers[index] = { ...data.volunteers[index], ...volData };
      writeJSON(data);
      return data.volunteers[index];
    }
    return null;
  }
};

const deleteVolunteer = async (id) => {
  if (!getFallbackStatus()) {
    return await Volunteer.findByIdAndDelete(id);
  } else {
    const data = readJSON();
    const index = data.volunteers.findIndex(item => item._id === id);
    if (index !== -1) {
      const deleted = data.volunteers.splice(index, 1)[0];
      writeJSON(data);
      return deleted;
    }
    return null;
  }
};

// Messages (Contact form submissions)
const getMessages = async () => {
  if (!getFallbackStatus()) {
    return await Message.find().sort({ createdAt: -1 });
  } else {
    const data = readJSON();
    return data.messages || [];
  }
};

const createMessage = async (msgData) => {
  if (!getFallbackStatus()) {
    const msg = new Message({ ...msgData, fixed: false });
    return await msg.save();
  } else {
    const data = readJSON();
    const newMsg = {
      _id: Date.now().toString(),
      ...msgData,
      fixed: false,
      createdAt: new Date().toISOString()
    };
    data.messages.unshift(newMsg);
    writeJSON(data);
    return newMsg;
  }
};

const updateMessage = async (id, msgData) => {
  if (!getFallbackStatus()) {
    return await Message.findByIdAndUpdate(id, msgData, { new: true });
  } else {
    const data = readJSON();
    const index = data.messages.findIndex(item => item._id === id);
    if (index !== -1) {
      data.messages[index] = { ...data.messages[index], ...msgData };
      writeJSON(data);
      return data.messages[index];
    }
    return null;
  }
};

// User (Admin authentication)
const getUser = async (username) => {
  if (!getFallbackStatus()) {
    return await User.findOne({ username });
  } else {
    const data = readJSON();
    return data.users.find(user => user.username === username) || null;
  }
};

const getUserByResetToken = async (token) => {
  if (!getFallbackStatus()) {
    return await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
  } else {
    const data = readJSON();
    return data.users.find(u => 
      u.resetPasswordToken === token && 
      new Date(u.resetPasswordExpires) > new Date()
    ) || null;
  }
};


const createUser = async (userData) => {
  if (!getFallbackStatus()) {
    const user = new User(userData);
    return await user.save();
  } else {
    const data = readJSON();
    const newUser = {
      _id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    data.users.push(newUser);
    writeJSON(data);
    return newUser;
  }
};

const getUsers = async () => {
  if (!getFallbackStatus()) {
    return await User.find().select('-password');
  } else {
    const data = readJSON();
    return (data.users || []).map(({ password, ...user }) => user);
  }
};

const updateUser = async (id, userData) => {
  if (!getFallbackStatus()) {
    return await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
  } else {
    const data = readJSON();
    const index = data.users.findIndex(user => user._id === id);
    if (index !== -1) {
      data.users[index] = { ...data.users[index], ...userData };
      writeJSON(data);
      const { password, ...user } = data.users[index];
      return user;
    }
    return null;
  }
};

const deleteUser = async (id) => {
  if (!getFallbackStatus()) {
    return await User.findByIdAndDelete(id);
  } else {
    const data = readJSON();
    const index = data.users.findIndex(user => user._id === id);
    if (index !== -1) {
      const deleted = data.users.splice(index, 1)[0];
      writeJSON(data);
      const { password, ...user } = deleted;
      return user;
    }
    return null;
  }
};

module.exports = {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getVolunteers,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
  getMessages,
  createMessage,
  updateMessage,
  getUser,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserByResetToken
};
