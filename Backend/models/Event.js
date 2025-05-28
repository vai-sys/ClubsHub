
const mongoose = require('mongoose');
const { Schema } = mongoose;


const EventSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  clubId: { type: Schema.Types.ObjectId, ref: 'Club', required: true },
  date: { type: Date, required: true },
  venue: { type: String },
  duration: { type: Number, required: true },
  tags: { type: [String], default: [] },
  fees: { type: Number, default: 0 },
  maxParticipants: { type: Number },
  registrationDeadline: { type: Date },
  platformLink: { type: String },
  eventBanner: { type: String },
  registeredParticipants: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    registrationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED'],
      default: 'PENDING'
    },
    isTeamLeader: { type: Boolean, default: false },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team' } 
  }],  
  eventType: {
    type: String,
    enum: ['WORKSHOP', 'SEMINAR', 'COMPETITION', 'MEETUP', 'CULTURAL', 'TECHNICAL', 'OTHER'],
    required: true
  },
  mode: {
    type: String,
    enum: ['ONLINE', 'OFFLINE', 'HYBRID'],
    required: true
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  attachments: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  departmentsAllowed: [{
    type: String,
    required: true
  }],
  approvalStatus: {
    type: String,
    enum: ['PENDING', 'FACULTY_APPROVED', 'SUPER_ADMIN_APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  facultyApproval: {
    approved: { type: Boolean, default: false },
    remark: { type: String, default: '' },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date }
  },
  superAdminApproval: {
    approved: { type: Boolean, default: false },
    remark: { type: String, default: '' },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date }
  },
}, {
  timestamps: true
});


const CompetitionSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },  
  rounds: [{
    name: { type: String, required: true }, 
    description: { type: String },  
    date: { type: Date },  
    duration: { type: Number, required: true }, 
    isLive: { type: Boolean, default: false } 
  }],
  prizes: [{
    position: { type: Number, required: true },  
    reward: { type: String, required: true }  
  }],
  teamAllowed: { type: Boolean, default: false }, 
  teamSizeLimit: { type: Number },
  judges: [{
    name: { type: String, required: true },
    profile: { type: String }, 
  
  }],
  evaluationCriteria: { type: String }, 
  rules: [{ type: String }],  

}, {
  timestamps: true
});

module.exports = {
  Event: mongoose.model('Event', EventSchema),
  Competition: mongoose.model('Competition', CompetitionSchema)
};
