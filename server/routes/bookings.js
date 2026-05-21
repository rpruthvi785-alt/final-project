const router = require('express').Router();
const { bookEvent, getUserBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, bookEvent);
router.get('/', protect, getUserBookings);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
