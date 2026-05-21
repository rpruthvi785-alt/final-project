const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
  keyword: { type: String, required: true, lowercase: true, trim: true },
  frequency: { type: Number, default: 1 },
  lastSearched: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Search', searchSchema);
