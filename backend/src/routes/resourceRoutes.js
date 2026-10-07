const express = require('express');
const { uploadResource, getResources, rateResource, reportResource } = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

// Upload a resource (Requires auth + file upload)
router.post('/upload', authMiddleware, uploadMiddleware.single('file'), uploadResource);

// Get resources for a specific subject
router.get('/subject/:subjectId', authMiddleware, getResources);

// Rate a resource (Helpful / Not Helpful)
router.post('/:resourceId/rate', authMiddleware, rateResource);

// Report a resource
router.post('/:resourceId/report', authMiddleware, reportResource);

module.exports = router;
