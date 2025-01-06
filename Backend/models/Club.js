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
  facultyCoordinater:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  ,
  clubMembers: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        default: "member", 
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
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
  clubCategory:{
    type:String,
    required:true
  }
});

const Club = mongoose.model('Club', ClubSchema);
module.exports = Club;
