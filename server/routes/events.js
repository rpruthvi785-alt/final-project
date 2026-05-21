const router = require('express').Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent, addReview } = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const eventUpload = upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'poster', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
  { name: 'organizerLogo', maxCount: 1 }
]);

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', protect, adminOnly, eventUpload, createEvent);
router.put('/:id', protect, adminOnly, eventUpload, updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
