const Event = require('../models/Event');
const Community = require('../models/Community');
const User = require('../models/User');

// @desc    Get recommended events
// @route   GET /api/recommendations/events
// @access  Private
const getRecommendedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const interests = user.interests || [];
    
    // Find events matching user interests
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

// @desc    Get recommended communities
// @route   GET /api/recommendations/communities
// @access  Private
const getRecommendedCommunities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const interests = user.interests || [];
    
    // Find communities matching user interests
    const communities = await Community.find({
      category: { $in: interests },
      members: { $ne: req.user.id }
    })
    .sort('-createdAt')
    .limit(10)
    .populate('organizer', 'name profileImage');
    
    res.status(200).json({ success: true, data: communities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRecommendedEvents,
  getRecommendedCommunities
};
