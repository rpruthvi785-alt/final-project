const express = require('express');
const router = express.Router();
const {
  getActivities, getActivity, createActivity, updateActivity,
  deleteActivity, joinActivity, leaveActivity, getMyActivities,
} = require('../controllers/activity.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getActivities);
router.get('/my', protect, getMyActivities);
router.get('/:id', getActivity);
router.post('/', protect, authorize('organizer', 'admin'), upload.single('activityImage'), createActivity);
router.put('/:id', protect, authorize('organizer', 'admin'), upload.single('activityImage'), updateActivity);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteActivity);
router.post('/:id/join', protect, joinActivity);
router.post('/:id/leave', protect, leaveActivity);

module.exports = router;
