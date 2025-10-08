const express = require('express');
const router = express.Router();
const Strand = require('../models/Strand');
const {
  handleValidationErrors,
  strandValidationRules,
  idValidationRules
} = require('../middleware/validation');

// GET /api/strands/thread/:threadId - Get all strands for a specific thread
router.get('/thread/:threadId',
  idValidationRules(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const strands = await Strand.find({ threadId: req.params.threadId })
        .sort({ createdAt: 1 });
      res.json(strands);
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to retrieve strands',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// POST /api/strands - Create a new strand
router.post('/',
  strandValidationRules(),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { threadId, contributorName, content } = req.body;

      const strand = new Strand({
        threadId,
        contributorName,
        content
      });

      const savedStrand = await strand.save();
      res.status(201).json({
        message: 'Strand created successfully',
        strand: savedStrand
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
        message: 'Failed to create strand',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

module.exports = router;
