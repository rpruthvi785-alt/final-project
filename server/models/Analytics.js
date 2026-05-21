const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalBookings: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  activeTrips: { type: Number, default: 0 },
  cancellations: { type: Number, default: 0 },
  newUsers: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
