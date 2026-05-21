const mongoose = require('mongoose');

const cancellationSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  reason: { type: String, required: true },
  refundStatus: { type: String, enum: ['Pending', 'Processed', 'Not Applicable'], default: 'Pending' },
  cancelledAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Cancellation', cancellationSchema);
