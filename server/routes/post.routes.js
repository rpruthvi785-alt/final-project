const express = require('express');
const router = express.Router();
const {
  getPosts, createPost, deletePost, toggleLike, addComment, deleteComment, getUserPosts,
} = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getPosts);
router.get('/user/:userId', getUserPosts);
router.post('/', protect, upload.array('images', 5), createPost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);

module.exports = router;
