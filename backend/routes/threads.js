const express = require('express');
const router = express.Router();
const Thread = require('../models/Thread');
const {
  handleValidationErrors,
  threadValidationRules,
  idValidationRules
} = require('../middleware/validation');

// GET /api/threads - Get all threads
router.get('/', async (req, res) => {
  try {
    const threads = await Thread.find().sort({ createdAt: -1 });
    res.json(threads);
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to retrieve threads',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/threads/:id - Get a single thread
router.get('/:id', 
  idValidationRules(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const thread = await Thread.findById(req.params.id);
      if (!thread) {
        return res.status(404).json({ message: 'Thread not found' });
      }
      res.json(thread);
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to retrieve thread',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// POST /api/threads - Create a new thread
router.post('/',
  threadValidationRules(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { title, description, tags } = req.body;

      const thread = new Thread({
        title,
        description,
        tags: tags || []
      });

      const savedThread = await thread.save();
      res.status(201).json({
        message: 'Thread created successfully',
        thread: savedThread
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Validation failed',
          errors: Object.keys(error.errors).map(key => ({
            field: key,
            message: error.errors[key].message
          }))
        });
      }
      res.status(500).json({ 
        message: 'Failed to create thread',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

module.exports = router;
