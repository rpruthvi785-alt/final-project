const Report = require('../models/Report');

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const { type, targetUser, targetPost, targetActivity, reason, description } = req.body;

    const report = await Report.create({
      reportedBy: req.user._id,
      type,
      targetUser,
      targetPost,
      targetActivity,
      reason,
      description,
    });

    res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('reportedBy', 'name email profileImage')
      .populate('targetUser', 'name email')
      .populate('targetPost', 'content')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Report.countDocuments(query);

    res.status(200).json({ success: true, reports, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update report status (Admin only)
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReport = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );

    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    res.status(200).json({ success: true, message: 'Report updated', report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createReport, getReports, updateReport };
