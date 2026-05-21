const mongoose = require('mongoose');

const momentSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  caption: { type: String, default: '' },
  type: { type: String, enum: ['Event Photo', 'Team Moment', 'Announcement', 'Travel Memory'], default: 'Team Moment' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Moment', momentSchema);
