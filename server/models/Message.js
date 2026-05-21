const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message cannot be empty'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    read: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['text', 'image'],
      default: 'text',
    },
    imageUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
