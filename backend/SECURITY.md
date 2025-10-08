# YARN.com Security Implementation

## Overview
This document outlines the security measures implemented to prevent XSS attacks and ensure data integrity in the YARN.com application.

## Security Features Implemented

### 1. Input Validation & Sanitization
- **Express-validator**: Comprehensive input validation for all user inputs
- **DOMPurify**: HTML sanitization to prevent XSS attacks
- **Custom validation rules**: Specific rules for threads and strands

### 2. XSS Protection
- HTML content sanitization using DOMPurify
- Only safe HTML tags allowed: `p`, `br`, `strong`, `em`, `u`, `ol`, `ul`, `li`
- No HTML attributes allowed
- Script tag detection and blocking
- Event handler detection (onclick, onload, etc.)

### 3. Input Validation Rules

#### Thread Validation
```javascript
{
  title: {
    length: "3-200 characters",
    pattern: "alphanumeric + basic punctuation",
    sanitization: "HTML sanitized"
  },
  description: {
    length: "10-1000 characters", 
    sanitization: "HTML sanitized"
  },
  tags: {
    maxCount: 10,
    itemLength: "2-30 characters each",
    pattern: "alphanumeric + hyphens/underscores",
    transformation: "lowercase"
  }
}
```

#### Strand Validation
```javascript
{
  threadId: {
    format: "Valid MongoDB ObjectId",
    validation: "MongoDB ID format check"
  },
  contributorName: {
    length: "2-100 characters",
    pattern: "alphanumeric + basic characters",
    sanitization: "HTML sanitized"
  },
  content: {
    length: "5-2000 characters",
    sanitization: "HTML sanitized"
  }
}
```

### 4. Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy`: Restrictive CSP rules
- `Permissions-Policy`: Limited permissions

### 5. Threat Detection
- XSS pattern detection
- SQL injection pattern detection
- Path traversal protection
- Suspicious input logging

### 6. Error Handling
- Structured error responses
- Clear validation error messages
- Security-conscious error disclosure
- Development vs production error details

## API Response Formats

### Success Response
```json
{
  "message": "Thread created successfully",
  "thread": {
    "_id": "...",
    "title": "...",
    "description": "...",
    "tags": [...],
    "createdAt": "..."
  }
}
```

### Validation Error Response
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 3 and 200 characters",
      "value": "AB"
    }
  ]
}
```

### Security Threat Response
```json
{
  "message": "Input contains potentially harmful content",
  "field": "description",
  "threats": ["XSS"]
}
```

## Dependencies Added
- `express-validator@^7.0.1`: Input validation and sanitization
- `dompurify@^3.0.5`: HTML sanitization
- `jsdom@^22.1.0`: DOM implementation for server-side DOMPurify

## Files Modified/Added

### New Files
- `middleware/validation.js`: Input validation and sanitization logic
- `middleware/security.js`: Security utilities and threat detection
- `test/security-validation-test.js`: Security testing examples

### Modified Files
- `package.json`: Added security dependencies
- `routes/threads.js`: Added validation middleware
- `routes/strands.js`: Added validation middleware  
- `server.js`: Enhanced with security middleware and error handling

## Testing the Security Implementation

### Valid Input Test
```bash
curl -X POST http://localhost:5000/api/threads \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Story Thread",
    "description": "This is a valid thread description.",
    "tags": ["story", "community"]
  }'
```

### XSS Attempt Test
```bash
curl -X POST http://localhost:5000/api/threads \
  -H "Content-Type: application/json" \
  -d '{
    "title": "<script>alert(\"XSS\")</script>Malicious",
    "description": "Contains <iframe src=\"javascript:alert(1)\"></iframe>",
    "tags": ["<script>alert(\"tag\")</script>"]
  }'
```

### Invalid Input Test
```bash
curl -X POST http://localhost:5000/api/threads \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AB",
    "description": "Too short",
    "tags": []
  }'
```

## Security Best Practices Implemented
1. **Defense in Depth**: Multiple layers of protection
2. **Input Validation**: Client and server-side validation
3. **Output Encoding**: Safe HTML rendering
4. **Least Privilege**: Minimal permissions and exposure
5. **Error Handling**: Secure error messages
6. **Logging**: Security event logging for monitoring

## Monitoring and Alerts
- Suspicious input attempts are logged
- Validation failures are tracked
- Security headers ensure browser-level protection
- Rate limiting can be easily added using the provided configuration

## Future Enhancements
- Rate limiting implementation
- CSRF protection
- Authentication and authorization
- Input/output logging for audit trails
- Automated security testing integration