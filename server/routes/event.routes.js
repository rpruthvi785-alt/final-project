const express = require('express');
const { 
  getEvents, 
  getEvent, 
  createEvent, 
  rsvpEvent, 
  likeEvent, 
  commentEvent, 
  addReview,
  getTrendingEvents,
  getNearbyEvents,
  getRecommendedEvents,
  saveEvent
} = require('../controllers/event.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/trending', getTrendingEvents);
router.get('/nearby', getNearbyEvents);
router.get('/recommended', protect, getRecommendedEvents);

router.route('/')
  .get(getEvents);

router.post('/create', protect, authorize('organizer', 'admin'), createEvent);

router.route('/:id')
  .get(getEvent);

router.route('/:id/rsvp')
  .put(protect, rsvpEvent); // Plan says PUT for RSVP

router.route('/:id/comment')
  .post(protect, commentEvent);

router.route('/:id/like')
  .post(protect, likeEvent);

router.route('/:id/save')
  .post(protect, saveEvent);

router.route('/:id/review')
  .post(protect, addReview);

module.exports = router;
