const express = require('express');
const router = express.Router();
const { createReport, getReports, updateReport } = require('../controllers/report.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, createReport);
router.get('/', protect, authorize('admin'), getReports);
router.put('/:id', protect, authorize('admin'), updateReport);

module.exports = router;
