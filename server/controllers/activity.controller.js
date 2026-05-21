const Activity = require('../models/Activity');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all activities with filters
// @route   GET /api/activities
// @access  Public
const getActivities = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, status, search, city } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (search) query.title = { $regex: search, $options: 'i' };

    const activities = await Activity.find(query)
      .populate('organizer', 'name profileImage role')
      .populate('participants', 'name profileImage')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Activity.countDocuments(query);

    res.status(200).json({
      success: true,
      activities,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('organizer', 'name profileImage bio')
      .populate('participants', 'name profileImage');

    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }

    res.status(200).json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create activity
// @route   POST /api/activities
// @access  Private (Organizer/Admin)
const createActivity = async (req, res) => {
  try {
    const {
      title, description, category, location,
      date, time, maxParticipants, tags, fee, difficulty,
    } = req.body;

    let activityImage = '';
    if (req.file) {
      activityImage = await uploadToCloudinary(req.file.buffer, 'activities');
    }

    const activity = await Activity.create({
      title,
      description,
      category,
      location: typeof location === 'string' ? JSON.parse(location) : location,
      date,
      time,
      maxParticipants,
      tags: tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [],
      fee: fee || 0,
      difficulty: difficulty || 'easy',
      activityImage,
      organizer: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Activity created successfully', activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private (Organizer who owns it / Admin)
const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    const isOwner = activity.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updates = req.body;
    if (updates.location && typeof updates.location === 'string') {
      updates.location = JSON.parse(updates.location);
    }

    if (req.file) {
      updates.activityImage = await uploadToCloudinary(req.file.buffer, 'activities');
    }

    const updated = await Activity.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Activity updated', activity: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private (Organizer who owns it / Admin)
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    const isOwner = activity.organizer.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await activity.deleteOne();
    res.status(200).json({ success: true, message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join activity
// @route   POST /api/activities/:id/join
// @access  Private
const joinActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    if (activity.participants.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already joined this activity' });
    }

    if (activity.participants.length >= activity.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Activity is full' });
    }

    activity.participants.push(req.user._id);
    await activity.save();

    // Notify organizer
    await User.findByIdAndUpdate(activity.organizer, {
      $push: {
        notifications: {
          message: `${req.user.name} joined your activity "${activity.title}"`,
          link: `/activities/${activity._id}`,
        },
      },
    });

    res.status(200).json({ success: true, message: 'Joined activity successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Leave activity
// @route   POST /api/activities/:id/leave
// @access  Private
const leaveActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });

    if (!activity.participants.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "You haven't joined this activity" });
    }

    activity.participants.pull(req.user._id);
    await activity.save();

    res.status(200).json({ success: true, message: 'Left activity successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get organizer's activities
// @route   GET /api/activities/my
// @access  Private
const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ organizer: req.user._id })
      .populate('participants', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  joinActivity,
  leaveActivity,
  getMyActivities,
};
