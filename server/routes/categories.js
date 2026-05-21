const router = require('express').Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const catUpload = upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);

router.get('/', getCategories);
router.post('/', protect, adminOnly, catUpload, createCategory);
router.put('/:id', protect, adminOnly, catUpload, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
