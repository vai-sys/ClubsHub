

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
    }
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
  status: {
    type: String,
    enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    default: 'UPCOMING'
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
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Event', EventSchema);
