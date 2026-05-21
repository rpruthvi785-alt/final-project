const express = require('express');
const { 
  getRecommendedEvents, 
  getRecommendedCommunities 
} = require('../controllers/recommendation.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/events', getRecommendedEvents);
router.get('/communities', getRecommendedCommunities);

module.exports = router;
