const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    targetPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    targetActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
    },
    type: {
      type: String,
      enum: ['user', 'post', 'activity'],
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      enum: [
        'spam', 'harassment', 'inappropriate content',
        'fake profile', 'violence', 'other',
      ],
    },
    description: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
    adminNote: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
