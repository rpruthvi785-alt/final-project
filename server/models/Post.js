const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    category: {
      type: String,
      enum: ['travel', 'activity', 'food', 'nature', 'general'],
      default: 'general',
    },
    location: { type: String, default: '' },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
