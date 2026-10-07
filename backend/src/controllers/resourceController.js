const prisma = require('../utils/db');

// Upload a new resource
exports.uploadResource = async (req, res) => {
  try {
    const { subjectId, title } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const resource = await prisma.resource.create({
      data: {
        title,
        fileUrl,
        subjectId: parseInt(subjectId),
        uploaderId: req.user.userId
      }
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get resources for a subject (only non-hidden)
exports.getResources = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const resources = await prisma.resource.findMany({
      where: { 
        subjectId: parseInt(subjectId),
        hidden: false
      },
      include: {
        uploader: { select: { name: true } },
        ratings: true
      }
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Rate a resource (Upvote / Downvote)
exports.rateResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { isHelpful } = req.body; // boolean
    const userId = req.user.userId;

    // Upsert rating: if exists, update it; else create it
    const rating = await prisma.resourceRating.upsert({
      where: {
        resourceId_userId: { resourceId: parseInt(resourceId), userId }
      },
      update: { isHelpful },
      create: {
        isHelpful,
        resourceId: parseInt(resourceId),
        userId
      }
    });

    res.json(rating);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Report a resource
exports.reportResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    // Check if user already reported this
    const existingReport = await prisma.report.findUnique({
      where: { resourceId_userId: { resourceId: parseInt(resourceId), userId } }
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this resource' });
    }

    await prisma.report.create({
      data: {
        reason,
        resourceId: parseInt(resourceId),
        userId
      }
    });

    // Check total reports for this resource
    const reportCount = await prisma.report.count({
      where: { resourceId: parseInt(resourceId) }
    });

    if (reportCount >= 3) {
      // Hide the resource
      const resource = await prisma.resource.update({
        where: { id: parseInt(resourceId) },
        data: { hidden: true }
      });

      // Suspend the uploader
      await prisma.user.update({
        where: { id: resource.uploaderId },
        data: { suspended: true }
      });
    }

    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
