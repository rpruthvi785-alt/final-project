const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  notes: { type: String, maxlength: 500 },
  photos: [{ type: String }],
  rating: { type: Number, min: 1, max: 5 },
  visitedAt: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ['city', 'nature', 'beach', 'mountain', 'historical', 'food', 'other'],
    default: 'other',
  },
});

const travelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 1000 },
    placesVisited: [placeSchema],
    coverImage: { type: String, default: '' },
    travelDate: { type: Date, default: Date.now },
    isPublic: { type: Boolean, default: true },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Travel', travelSchema);
