const mongoose = require('mongoose');

const tripHistorySchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  completedAt: { type: Date, default: Date.now },
  totalBookings: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  cancellations: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('TripHistory', tripHistorySchema);
