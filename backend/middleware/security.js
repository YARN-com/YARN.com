// Security utility functions and constants

// Content Security Policy settings
const CSP_SETTINGS = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:"],
  'connect-src': ["'self'"],
  'font-src': ["'self'"],
  'object-src': ["'none'"],
  'media-src': ["'self'"],
  'frame-src': ["'none'"]
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
};

// Input sanitization patterns
const SECURITY_PATTERNS = {
  // Basic XSS patterns to detect
  XSS_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi
  ],
  
  // SQL injection patterns
  SQL_INJECTION_PATTERNS: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(--|#|\/\*|\*\/)/gi,
    /(\b(OR|AND)\b.*=.*)/gi
  ],
  
  // Path traversal patterns
  PATH_TRAVERSAL_PATTERNS: [
    /\.\.\//gi,
    /\.\.\\/gi,
    /%2e%2e%2f/gi,
    /%2e%2e%5c/gi
  ]
};

// Check for suspicious patterns in input
const detectSuspiciousInput = (input) => {
  const threats = [];
  
  // Check for XSS
  SECURITY_PATTERNS.XSS_PATTERNS.forEach(pattern => {
    if (pattern.test(input)) {
      threats.push('XSS');
    }
  });
  
  // Check for SQL injection
  SECURITY_PATTERNS.SQL_INJECTION_PATTERNS.forEach(pattern => {
    if (pattern.test(input)) {
      threats.push('SQL_INJECTION');
    }
  });
  
  // Check for path traversal
  SECURITY_PATTERNS.PATH_TRAVERSAL_PATTERNS.forEach(pattern => {
    if (pattern.test(input)) {
      threats.push('PATH_TRAVERSAL');
    }
  });
  
  return threats;
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Set Content Security Policy
  const cspHeader = Object.entries(CSP_SETTINGS)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
  res.setHeader('Content-Security-Policy', cspHeader);
  
  next();
};

// Input threat detection middleware
const threatDetection = (req, res, next) => {
  const checkInput = (obj, path = '') => {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        const threats = detectSuspiciousInput(value);
        if (threats.length > 0) {
          console.warn(`Potential security threat detected at ${currentPath}:`, threats);
          return res.status(400).json({
            message: 'Input contains potentially harmful content',
            field: currentPath,
            threats: threats
          });
        }
      } else if (typeof value === 'object' && value !== null) {
        const result = checkInput(value, currentPath);
        if (result) return result;
      }
    }
  };
  
  if (req.body && typeof req.body === 'object') {
    const threatResult = checkInput(req.body);
    if (threatResult) return threatResult;
  }
  
  if (req.query && typeof req.query === 'object') {
    const threatResult = checkInput(req.query);
    if (threatResult) return threatResult;
  }
  
  next();
};

module.exports = {
  CSP_SETTINGS,
  RATE_LIMIT_CONFIG,
  SECURITY_PATTERNS,
  detectSuspiciousInput,
  securityHeaders,
  threatDetection
};