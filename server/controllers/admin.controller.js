const Event = require('../models/Event');

// @desc    Get all pending events
// @route   GET /api/admin/events/pending
// @access  Private/Admin
const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ visibilityStatus: 'pending_approval' })
      .populate('organizer', 'name email')
      .sort('-createdAt');
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject an event
// @route   PUT /api/admin/events/:id/status
// @access  Private/Admin
const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { visibilityStatus: status },
      { new: true, runValidators: true }
    );

    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    res.status(200).json({ success: true, message: `Event ${status}`, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPendingEvents, updateEventStatus };
