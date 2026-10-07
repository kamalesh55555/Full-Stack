const express = require('express');
const { createSession, getSessions } = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new live session
router.post('/', authMiddleware, createSession);

// Get sessions for a specific subject
router.get('/subject/:subjectId', authMiddleware, getSessions);

module.exports = router;
