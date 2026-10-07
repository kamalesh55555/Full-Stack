const prisma = require('../utils/db');

// Create a new LiveSession
exports.createSession = async (req, res) => {
  try {
    const { topic, date, time, meetLink, subjectId } = req.body;
    const hostId = req.user.userId;

    const session = await prisma.liveSession.create({
      data: {
        topic,
        date,
        time,
        meetLink,
        subjectId: parseInt(subjectId),
        hostId
      }
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get LiveSessions for a specific subject
exports.getSessions = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    const sessions = await prisma.liveSession.findMany({
      where: { subjectId: parseInt(subjectId) },
      include: {
        host: { select: { name: true, email: true } }
      },
      orderBy: {
        date: 'asc'
      }
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
