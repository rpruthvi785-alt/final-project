const Post = require('../models/Post');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const query = { isPublic: true };
    if (category) query.category = category;

    const posts = await Post.find(query)
      .populate('user', 'name profileImage role')
      .populate('comments.user', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);

    res.status(200).json({ success: true, posts, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { content, category, location } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(f => uploadToCloudinary(f.buffer, 'posts'));
      images = await Promise.all(uploadPromises);
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      images,
      category: category || 'general',
      location: location || '',
    });

    await post.populate('user', 'name profileImage role');

    res.status(201).json({ success: true, message: 'Post created', post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (owner or admin)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const isOwner = post.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like / Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const liked = post.likes.includes(req.user._id);
    if (liked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();

    res.status(200).json({
      success: true,
      liked: !liked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, message: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({ user: req.user._id, text });
    await post.save();
    await post.populate('comments.user', 'name profileImage');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/posts/:id/comment/:commentId
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const isOwner = comment.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Public
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId, isPublic: true })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPosts, createPost, deletePost, toggleLike, addComment, deleteComment, getUserPosts };
