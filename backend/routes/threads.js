const express = require("express");
const router = express.Router();
const Thread = require("../models/Thread");
const { getLimiter, postLimiter } = require("../middleware/rateLimiters.js");

// GET /api/threads - Get all threads
router.get("/", getLimiter, async (req, res) => {
  try {
    const threads = await Thread.find().sort({ createdAt: -1 });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/threads/:id - Get a single thread
router.get("/:id", getLimiter, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }
    res.json(thread);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/threads - Create a new thread
router.post("/", postLimiter, async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const thread = new Thread({
      title,
      description,
      tags: tags || [],
    });

    const savedThread = await thread.save();
    res.status(201).json(savedThread);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
