const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventTitle: { type: String, required: true },
  eventSubtitle: { type: String, default: '' },
  eventDescription: { type: String, default: '' },
  eventType: { type: String, enum: ['In-Person', 'Online', 'Hybrid'], default: 'In-Person' },
  eventTags: [String],
  
  // Images
  eventBanner: { type: String, default: '' },
  eventPoster: { type: String, default: '' },
  eventThumbnail: { type: String, default: '' },
  eventGallery: [String],
  
  // Relations
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  
  // Details
  eventDate: { type: Date, required: true },
  startTime: { type: String, default: '' },
  endTime: { type: String, default: '' },
  venue: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
  googleMapLink: { type: String, default: '' },
  
  // Organizer
  organizerName: { type: String, default: '' },
  organizerLogo: { type: String, default: '' },
  organizerContact: { type: String, default: '' },
  organizerEmail: { type: String, default: '' },
  organizerWebsite: { type: String, default: '' },
  
  // Tickets / Donation
  isFree: { type: Boolean, default: false },
  suggestedDonation: { type: Number, default: 0 },
  estimatedTravelBudget: { type: Number, default: 0 },
  vipPrice: { type: Number, default: 0 },
  availableSeats: { type: Number, default: 0 },
  earlyBirdOffer: { type: String, default: '' },
  
  // Expenditure Breakdown
  expenditure: {
    transport: { type: Number, default: 0 },
    accommodation: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    activities: { type: Number, default: 0 },
    permits: { type: Number, default: 0 },
    miscellaneous: { type: Number, default: 0 }
  },
  
  // Trip Info
  duration: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard', 'Extreme', ''], default: '' },
  highlights: [{ type: String }],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  
  // Additional Sections
  speakers: [{ 
    name: String, 
    designation: String, 
    image: String,
    socialLinks: { twitter: String, linkedin: String }
  }],
  sponsors: [{ name: String, logo: String, type: String }],
  schedule: [{ time: String, activity: String, description: String }],
  FAQs: [{ question: String, answer: String }],
  termsAndConditions: { type: String, default: '' },
  
  // Social/Reviews
  reviews: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  eventStatus: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
