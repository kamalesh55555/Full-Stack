const express = require('express');
const { getUniversities, getCourses, getSubjects, getSubjectDetail } = require('../controllers/academyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public — anyone can see the list of universities
router.get('/universities', getUniversities);

// Protected — must be logged in to drill into content
router.get('/universities/:universityId/courses', authMiddleware, getCourses);
router.get('/courses/:courseId/subjects', authMiddleware, getSubjects);
router.get('/subjects/:subjectId', authMiddleware, getSubjectDetail);

module.exports = router;
