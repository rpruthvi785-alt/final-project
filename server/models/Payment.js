const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Using Event for Trip
  amount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash on Arrival' },
  status: { type: String, enum: ['Paid', 'Pending', 'Failed', 'Refunded'], default: 'Pending' },
  transactionId: { type: String, default: '' },
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
