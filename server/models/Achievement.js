const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true }, // e.g. "Top Manager", "Revenue Champion"
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  awardedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Achievement', achievementSchema);
