const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  description: String,
  bannerImage: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  posts: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    media: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  rules: [String],
  tags: [String],
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);
