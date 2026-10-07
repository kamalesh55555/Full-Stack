const prisma = require('../utils/db');

// GET /api/academy/universities — Public
exports.getUniversities = async (req, res) => {
  try {
    const universities = await prisma.university.findMany({
      include: { _count: { select: { courses: true } } }
    });
    res.json(universities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/academy/universities/:universityId/courses — Protected
exports.getCourses = async (req, res) => {
  try {
    const { universityId } = req.params;
    const university = await prisma.university.findUnique({
      where: { id: parseInt(universityId) }
    });
    const courses = await prisma.course.findMany({
      where: { universityId: parseInt(universityId) },
      include: { _count: { select: { subjects: true } } }
    });
    res.json({ university, courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/academy/courses/:courseId/subjects — Protected
exports.getSubjects = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: { university: true }
    });
    const subjects = await prisma.subject.findMany({
      where: { courseId: parseInt(courseId) },
      orderBy: { semester: 'asc' },
      include: { _count: { select: { resources: true } } }
    });
    res.json({ course, subjects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/academy/subjects/:subjectId — Protected
exports.getSubjectDetail = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(subjectId) },
      include: {
        course: { include: { university: true } },
        resources: {
          where: { hidden: false },
          include: {
            uploader: { select: { id: true, name: true } },
            ratings: true,
            reports: true
          },
          orderBy: { createdAt: 'desc' }
        },
        sessions: {
          include: { host: { select: { id: true, name: true, email: true } } },
          orderBy: { date: 'asc' }
        }
      }
    });
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
