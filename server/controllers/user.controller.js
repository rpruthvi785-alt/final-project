const User = require('../models/User');
const Activity = require('../models/Activity');
const Post = require('../models/Post');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const Community = require('../models/Community');
const Event = require('../models/Event');

// @desc    Get user profile by ID
// @route   GET /api/users/profile/:id
// @access  Public
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .populate('followers', 'name profileImage')
      .populate('following', 'name profileImage');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, bio, interests, location } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (interests) updateData.interests = interests;
    if (location) updateData.location = location;

    // Handle image upload
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'profiles');
      updateData.profileImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (for suggestions)
// @route   GET /api/users/all
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (role) query.role = role;

    const users = await User.find(query)
      .populate('savedEvents', 'eventTitle') // Include titles of trips they saved/booked
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Block / Unblock user (Admin only)
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.isBlocked ? 'User blocked' : 'User unblocked',
      isBlocked: user.isBlocked,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Follow / Unfollow a user
// @route   POST /api/users/:id/follow
// @access  Private
const toggleFollow = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You can't follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, message: 'User not found' });

    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      currentUser.following.pull(req.params.id);
      targetUser.followers.pull(req.user._id);
    } else {
      currentUser.following.push(req.params.id);
      targetUser.followers.push(req.user._id);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: isFollowing ? 'Unfollowed' : 'Followed',
      following: !isFollowing,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get platform analytics (Admin)
// @route   GET /api/users/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalActivities, totalPosts, usersByRole] = await Promise.all([
      User.countDocuments(),
      Activity.countDocuments(),
      Post.countDocuments(),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    ]);

    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalActivities,
        totalPosts,
        usersByRole,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('notifications');
    res.status(200).json({ success: true, notifications: user.notifications.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notifications as read
// @route   PUT /api/users/notifications/read
// @access  Private
const markNotificationsRead = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { 'notifications.$[].read': true },
    });
    res.status(200).json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get smart recommendations (Events & Communities)
// @route   GET /api/users/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const interests = user.interests || [];

    // Basic matching: return events and communities matching user interests
    // Also randomly select some trending ones if interests are empty
    const query = interests.length > 0 ? { category: { $in: interests } } : {};

    const recommendedCommunities = await Community.find(query).limit(5);
    const recommendedEvents = await Event.find(query).limit(5);

    res.status(200).json({
      success: true,
      recommendations: {
        communities: recommendedCommunities,
        events: recommendedEvents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  toggleFollow,
  getAnalytics,
  getNotifications,
  markNotificationsRead,
  getRecommendations,
};
