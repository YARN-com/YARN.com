const express = require("express");
const router = express.Router();
const Strand = require("../models/Strand");
const { getLimiter, postLimiter } = require("../middleware/rateLimiters.js");

// GET /api/strands/thread/:threadId - Get all strands for a specific thread
router.get("/thread/:threadId", getLimiter, async (req, res) => {
  try {
    const strands = await Strand.find({ threadId: req.params.threadId }).sort({
      createdAt: 1,
    });
    res.json(strands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/strands - Create a new strand
router.post("/", postLimiter, async (req, res) => {
  try {
    const { threadId, contributorName, content } = req.body;

    if (!threadId || !contributorName || !content) {
      return res.status(400).json({
        message: "Thread ID, contributor name, and content are required",
      });
    }

    const strand = new Strand({
      threadId,
      contributorName,
      content,
    });

    const savedStrand = await strand.save();
    res.status(201).json(savedStrand);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
