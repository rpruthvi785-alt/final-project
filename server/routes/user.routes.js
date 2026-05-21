const express = require('express');
const router = express.Router();
const {
  getUserProfile, updateProfile, getAllUsers,
  toggleBlockUser, deleteUser, toggleFollow,
  getAnalytics, getNotifications, markNotificationsRead, getRecommendations,
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/analytics', protect, authorize('admin'), getAnalytics);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markNotificationsRead);
router.get('/recommendations', protect, getRecommendations);
router.get('/profile/:id', getUserProfile);
router.get('/all', protect, getAllUsers);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.put('/:id/block', protect, authorize('admin'), toggleBlockUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.post('/:id/follow', protect, toggleFollow);
router.get('/search', protect, getAllUsers);

module.exports = router;
