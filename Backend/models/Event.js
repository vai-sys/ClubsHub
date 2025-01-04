const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  }, 
  
  description: { 
    type: String, 
    required: true 
  }, 
  
  ClubId: { 
    type: Schema.Types.ObjectId,
    ref: 'Club',
    required: [true, 'Club ID is required']
  }, 
  
  date: { 
    type: Date, 
    required: true 
  }, 
  
  venue: { 
    type: String, 
    required: true 
  }, 
  
  duration: { 
    type: Number, 
    required: true 
  }, 
  
  tags: { 
    type: [String], 
    trim: true, 
    default: [] 
  }, 

  fees:{
    type:Number
  },
  
  maxParticipants: { 
    type: Number 
  }, 
  
  registrationDeadline: { 
    type: Date 
  }, 
  
  platformLink: { 
    type: String 
  }, 
  
  eventBanner: {
    type: String,
    required: [true, 'Event banner image is required']
  }, 
  
  registeredParticipants: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED'],
      default: 'PENDING'
    }
  }], 
  
  eventType: {
    type: String,
    enum: ['WORKSHOP', 'SEMINAR', 'COMPETITION', 'MEETUP', 'CULTURAL', 'TECHNICAL', 'OTHER'],
    required: [true, 'Event type is required']
  }, 
  
  mode: {
    type: String,
    enum: ['ONLINE', 'OFFLINE', 'HYBRID'],
    required: [true, 'Event mode is required']
  }, 
  
  status: { 
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming"
  }, 
  
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, 
  
  attachments: [{ 
    type: String 
  }], 
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }, 
  
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }, 
});

module.exports = mongoose.model('Event', EventSchema);
