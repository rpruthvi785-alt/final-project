const Message = require('../models/Message');

// @desc    Get conversation between two users
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send message (REST fallback)
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    if (!receiverId || !message) {
      return res.status(400).json({ success: false, message: 'Receiver and message are required' });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message,
    });

    await newMessage.populate([
      { path: 'sender', select: 'name profileImage' },
      { path: 'receiver', select: 'name profileImage' },
    ]);

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get list of conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage');

    // Build unique conversation list
    const conversationMap = new Map();
    messages.forEach((msg) => {
      const otherId =
        msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver._id.toString()
          : msg.sender._id.toString();

      if (!conversationMap.has(otherId)) {
        const otherUser =
          msg.sender._id.toString() === req.user._id.toString() ? msg.receiver : msg.sender;
        conversationMap.set(otherId, {
          user: otherUser,
          lastMessage: msg.message,
          timestamp: msg.createdAt,
          unread: msg.sender._id.toString() !== req.user._id.toString() && !msg.read ? 1 : 0,
        });
      }
    });

    res.status(200).json({ success: true, conversations: Array.from(conversationMap.values()) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMessages, sendMessage, getConversations };
