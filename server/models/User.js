const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'organizer', 'user'], default: 'user' },
  bio: { type: String, default: '' },
  interests: [String],
  location: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  joinedCommunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  isBlocked: { type: Boolean, default: false },
  notifications: [{
    type: { type: String },
    message: { type: String },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
