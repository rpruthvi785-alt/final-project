const Travel = require('../models/Travel');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get user travel logs
// @route   GET /api/travel/:userId
// @access  Public
const getTravelLogs = async (req, res) => {
  try {
    const travels = await Travel.find({ user: req.params.userId, isPublic: true })
      .populate('user', 'name profileImage')
      .sort({ travelDate: -1 });

    res.status(200).json({ success: true, travels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my travel logs
// @route   GET /api/travel/my
// @access  Private
const getMyTravels = async (req, res) => {
  try {
    const travels = await Travel.find({ user: req.user._id }).sort({ travelDate: -1 });
    res.status(200).json({ success: true, travels });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single travel log
// @route   GET /api/travel/log/:id
// @access  Public
const getTravelLog = async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id).populate('user', 'name profileImage');
    if (!travel) return res.status(404).json({ success: false, message: 'Travel log not found' });

    res.status(200).json({ success: true, travel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create travel log
// @route   POST /api/travel
// @access  Private
const createTravelLog = async (req, res) => {
  try {
    const { title, description, placesVisited, travelDate, isPublic, tags } = req.body;

    let coverImage = '';
    if (req.file) {
      coverImage = await uploadToCloudinary(req.file.buffer, 'travel-covers');
    }

    const travel = await Travel.create({
      user: req.user._id,
      title,
      description,
      placesVisited: placesVisited ? (typeof placesVisited === 'string' ? JSON.parse(placesVisited) : placesVisited) : [],
      travelDate: travelDate || Date.now(),
      isPublic: isPublic !== undefined ? isPublic : true,
      tags: tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [],
      coverImage,
    });

    res.status(201).json({ success: true, message: 'Travel log created', travel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update travel log
// @route   PUT /api/travel/:id
// @access  Private
const updateTravelLog = async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) return res.status(404).json({ success: false, message: 'Travel log not found' });

    if (travel.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updates = { ...req.body };
    if (updates.placesVisited && typeof updates.placesVisited === 'string') {
      updates.placesVisited = JSON.parse(updates.placesVisited);
    }

    if (req.file) {
      updates.coverImage = await uploadToCloudinary(req.file.buffer, 'travel-covers');
    }

    const updated = await Travel.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ success: true, message: 'Travel log updated', travel: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete travel log
// @route   DELETE /api/travel/:id
// @access  Private
const deleteTravelLog = async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) return res.status(404).json({ success: false, message: 'Travel log not found' });

    if (travel.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await travel.deleteOne();
    res.status(200).json({ success: true, message: 'Travel log deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTravelLogs, getMyTravels, getTravelLog, createTravelLog, updateTravelLog, deleteTravelLog };
