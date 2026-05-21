const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String },
      country: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    date: { type: Date, required: [true, 'Date is required'] },
    time: { type: String, required: [true, 'Time is required'] },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    maxParticipants: {
      type: Number,
      default: 20,
      min: [1, 'At least 1 participant required'],
    },
    activityImage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [String],
    fee: { type: Number, default: 0 },
    difficulty: {
      type: String,
      enum: ['easy', 'moderate', 'hard'],
      default: 'easy',
    },
  },
  { timestamps: true }
);

// Virtual: spots left
activitySchema.virtual('spotsLeft').get(function () {
  return this.maxParticipants - this.participants.length;
});

module.exports = mongoose.model('Activity', activitySchema);
