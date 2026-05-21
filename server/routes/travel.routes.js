const express = require('express');
const router = express.Router();
const {
  getTravelLogs, getMyTravels, getTravelLog, createTravelLog, updateTravelLog, deleteTravelLog,
} = require('../controllers/travel.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/my', protect, getMyTravels);
router.get('/log/:id', getTravelLog);
router.get('/:userId', getTravelLogs);
router.post('/', protect, upload.single('coverImage'), createTravelLog);
router.put('/:id', protect, upload.single('coverImage'), updateTravelLog);
router.delete('/:id', protect, deleteTravelLog);

module.exports = router;
