const mongoose = require('mongoose');

const eventApprovalSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  approvedAt: {
    type: Date,
    default: Date.now,
  },
  approvalStatus: {
    type: String,
    enum: ['approved', 'rejected'],
    required: true,
  },
  role: {
    type: String,
    enum: ['superAdmin', 'faculty'],
    required: true,
  },
});

const EventApproval = mongoose.model('EventApproval', eventApprovalSchema);
module.exports = EventApproval;
