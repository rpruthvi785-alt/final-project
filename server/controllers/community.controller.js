const Community = require('../models/Community');
const User = require('../models/User');
const { updateGamification } = require('../utils/gamification');

// @desc    Get all communities
// @route   GET /api/communities
// @access  Public
const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate('organizer', 'name profileImage')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: communities.length, data: communities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single community
// @route   GET /api/communities/:id
// @access  Public
const getCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('organizer', 'name profileImage bio')
      .populate('members', 'name profileImage');
    
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    
    res.status(200).json({ success: true, data: community });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new community
// @route   POST /api/communities
// @access  Private (Organizer/Admin)
const createCommunity = async (req, res) => {
  try {
    req.body.organizer = req.user.id;
    req.body.members = [req.user.id]; // Organizer is first member
    
    const community = await Community.create(req.body);
    
    // Add to user's joined communities and give points
    await User.findByIdAndUpdate(req.user.id, {
      $push: { joinedCommunities: community._id }
    });
    await updateGamification(req.user.id, 'create_event'); // Reusing create_event for community creation points for now or add create_community

    res.status(201).json({ success: true, data: community });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join/Leave community
// @route   POST /api/communities/:id/join
// @access  Private
const toggleJoinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });

    const isMember = community.members.includes(req.user.id);

    if (isMember) {
      community.members = community.members.filter(id => id.toString() !== req.user.id);
      await User.findByIdAndUpdate(req.user.id, { $pull: { joinedCommunities: community._id } });
    } else {
      community.members.push(req.user.id);
      await User.findByIdAndUpdate(req.user.id, { 
        $push: { joinedCommunities: community._id }
      });
      await updateGamification(req.user.id, 'join_community');
    }

    await community.save();
    res.status(200).json({ success: true, message: isMember ? 'Left community' : 'Joined community', data: community });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create post in community
// @route   POST /api/communities/:id/post
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content, media } = req.body;
    const community = await Community.findById(req.params.id);
    
    if (!community) return res.status(404).json({ success: false, message: 'Community not found' });
    
    // Check if user is member
    if (!community.members.includes(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Must be a member to post' });
    }

    const newPost = {
      user: req.user.id,
      content,
      media: media || [],
      likes: [],
      comments: [],
      createdAt: new Date()
    };

    community.posts.push(newPost);
    await community.save();
    
    await updateGamification(req.user.id, 'create_post');

    await community.populate('posts.user', 'name profileImage');

    res.status(201).json({ success: true, data: community.posts[community.posts.length - 1] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCommunities, getCommunity, createCommunity, toggleJoinCommunity, createPost };
