const router = require('express').Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');

const catUpload = upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

router.get('/', getCategories);
router.post('/', protect, authorize('admin'), catUpload, createCategory);
router.put('/:id', protect, authorize('admin'), catUpload, updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
