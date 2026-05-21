const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  roleTitle: { type: String, default: 'Super Admin' },
  avatar: { type: String, default: '' },
  contactNumber: { type: String, default: '' },
  themePreference: { type: String, enum: ['light', 'dark'], default: 'dark' },
  settings: {
    notificationsEnabled: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
