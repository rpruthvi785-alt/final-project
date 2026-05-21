const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  categoryDescription: { type: String, default: '' },
  categoryBannerImage: { type: String, default: '' },
  categoryThumbnail: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
