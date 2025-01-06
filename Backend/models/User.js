const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { UserRoles } = require('../config/constants');

const userSchema = new mongoose.Schema({
  name: {                             
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  role: {
    type: String,
    enum: Object.values(UserRoles),
    default: UserRoles.MEMBER,
  },
  clubAffiliations: [{               
    clubId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Club',
      required: true,
    },
    clubName: {
      type: String,
      required: true,
      trim: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  department: {
    type: String,
    enum: ['Computer Science', 'Information Technology', 'Computer Science and Business System', 'Electronic and Telecommunication', 'Mechanical', 'Civil', 'Electrical', 'Automation Robotics'],
    required: true, 
  },
  year: {
    type: String, 
    enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year'],

  },
  image:{
    type: String
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
