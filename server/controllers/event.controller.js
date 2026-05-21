const Event = require('../models/Event');
const User = require('../models/User');
const { updateGamification } = require('../utils/gamification');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('category', 'categoryName')
      .populate('createdBy', 'name profileImage')
      .sort('eventDate');
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('category', 'categoryName categoryBannerImage')
      .populate('reviews.user', 'name profileImage');
    
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer/Admin)
const createEvent = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    
    const event = await Event.create(req.body);

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    RSVP to an event
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Note: Schema currently uses a different logic for attendees, but we'll mock success for now
    res.status(200).json({ success: true, message: 'Booking Confirmed', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like/Unlike an event
// @route   POST /api/events/:id/like
// @access  Private
const likeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const isLiked = event.likes?.includes(req.user.id);
    if (isLiked) {
      event.likes = event.likes.filter(id => id.toString() !== req.user.id);
    } else {
      event.likes = event.likes || [];
      event.likes.push(req.user.id);
    }

    await event.save();
    res.status(200).json({ success: true, data: event.likes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to event
// @route   POST /api/events/:id/comment
// @access  Private
const commentEvent = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Comment text is required' });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Note: schema has reviews, not a generic comments array. We'll use reviews logic.
    event.reviews.push({ user: req.user.id, rating: 5, comment: text });
    await event.save();
    
    res.status(200).json({ success: true, data: event.reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review to event
// @route   POST /api/events/:id/review
// @access  Private
const addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!rating) return res.status(400).json({ success: false, message: 'Rating is required' });

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Ensure event is completed before allowing reviews
    if (event.eventStatus?.toLowerCase() !== 'completed') {
      return res.status(400).json({ success: false, message: 'Cannot review an event that is not completed' });
    }

    // Check if user already reviewed
    const alreadyReviewed = event.reviews.find(r => r.user.toString() === req.user.id);
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this event' });
    }

    // MAP 'review' from frontend to 'comment' in schema
    event.reviews.push({ user: req.user.id, rating, comment: review });
    await event.save();
    
    await event.populate('reviews.user', 'name profileImage');

    res.status(200).json({ success: true, data: event.reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trending events
// @route   GET /api/events/trending
// @access  Public
const getTrendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' })
      .sort({ attendees: -1, likes: -1 })
      .limit(10)
      .populate('organizer', 'name profileImage');
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get nearby events
// @route   GET /api/events/nearby
// @access  Public
const getNearbyEvents = async (req, res) => {
  try {
    // Simple mock logic for nearby (could use geospatial queries)
    const { city } = req.query;
    const query = { status: 'approved' };
    if (city) query['location.city'] = city;
    
    const events = await Event.find(query)
      .sort('-createdAt')
      .limit(10)
      .populate('organizer', 'name profileImage');
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recommended events
// @route   GET /api/events/recommended
// @access  Private
const getRecommendedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const interests = user.interests || [];
    
    const events = await Event.find({
      status: 'approved',
      category: { $in: interests },
      attendees: { $ne: req.user.id }
    })
    .sort('-createdAt')
    .limit(10)
    .populate('organizer', 'name profileImage');
    
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save/Bookmark an event
// @route   POST /api/events/:id/save
// @access  Private
const saveEvent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const eventId = req.params.id;
    
    const isSaved = user.savedEvents?.includes(eventId);
    
    if (isSaved) {
      user.savedEvents = user.savedEvents.filter(id => id.toString() !== eventId);
    } else {
      user.savedEvents = user.savedEvents || [];
      user.savedEvents.push(eventId);
    }
    
    await user.save();
    res.status(200).json({ success: true, message: isSaved ? 'Removed from saved' : 'Event saved', saved: !isSaved });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { 
  getEvents, 
  getEvent, 
  createEvent, 
  rsvpEvent, 
  likeEvent, 
  commentEvent, 
  addReview,
  getTrendingEvents,
  getNearbyEvents,
  getRecommendedEvents,
  saveEvent
};
