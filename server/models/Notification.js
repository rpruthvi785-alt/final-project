const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // admin user
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['Booking', 'Payment', 'Cancellation', 'System', 'Alert'], default: 'System' },
  read: { type: Boolean, default: false },
  link: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
