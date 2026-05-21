const express = require('express');
const { 
  getCommunities, 
  getCommunity, 
  createCommunity, 
  toggleJoinCommunity,
  createPost
} = require('../controllers/community.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .get(getCommunities);

router.post('/create', protect, authorize('organizer', 'admin'), createCommunity);

router.route('/:id')
  .get(getCommunity);

router.post('/:id/join', protect, toggleJoinCommunity);
router.post('/:id/post', protect, createPost);

module.exports = router;
