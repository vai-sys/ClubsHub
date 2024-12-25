const mongoose = require("mongoose");

const ClubSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    clubLeadId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    clubLogo: {
      type: String,
      required: true,
      trim: true,
    },
    clubMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now, 
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  });
  

const Club = mongoose.model('Club', ClubSchema);
module.exports = Club;
