

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
  approvalStatusRole: {
      type: String,
      enum: ['approved', 'rejected'],
      required: true,
  },
  role: {
      type: String,
      enum: ['facultyCoordinator', 'superAdmin'],
      required: true,
  },
  remark: {
      type: String,
      default: ''
  }
});

const EventApproval = mongoose.model('EventApproval', eventApprovalSchema);
module.exports = EventApproval;
