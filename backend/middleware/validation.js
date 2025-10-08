const { body, param, validationResult } = require('express-validator');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// Sanitize HTML content
const sanitizeHTML = (content) => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: []
  });
};

// Thread validation rules
const threadValidationRules = () => {
  return [
    body('title')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Title must be between 3 and 200 characters')
      .matches(/^[a-zA-Z0-9\s\-.,!?'"()]+$/)
      .withMessage('Title contains invalid characters')
      .customSanitizer(value => sanitizeHTML(value)),
    
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters')
      .customSanitizer(value => sanitizeHTML(value)),
    
    body('tags')
      .optional()
      .isArray({ max: 10 })
      .withMessage('Maximum 10 tags allowed'),
    
    body('tags.*')
      .optional()
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Each tag must be between 2 and 30 characters')
      .matches(/^[a-zA-Z0-9\-_]+$/)
      .withMessage('Tags can only contain letters, numbers, hyphens, and underscores')
      .toLowerCase()
  ];
};

// Strand validation rules
const strandValidationRules = () => {
  return [
    body('threadId')
      .trim()
      .isMongoId()
      .withMessage('Invalid thread ID format'),
    
    body('contributorName')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Contributor name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z0-9\s\-._]+$/)
      .withMessage('Contributor name contains invalid characters')
      .customSanitizer(value => sanitizeHTML(value)),
    
    body('content')
      .trim()
      .isLength({ min: 5, max: 2000 })
      .withMessage('Content must be between 5 and 2000 characters')
      .customSanitizer(value => sanitizeHTML(value))
  ];
};

// ID parameter validation
const idValidationRules = () => {
  return [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format'),
    param('threadId')
      .optional()
      .isMongoId()
      .withMessage('Invalid thread ID format')
  ];
};

module.exports = {
  handleValidationErrors,
  sanitizeHTML,
  threadValidationRules,
  strandValidationRules,
  idValidationRules
};