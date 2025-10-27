const rateLimit = require("express-rate-limit");

// GET requests limiter
const getLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // max 100 requests per 15 mins
  message: "Too many GET requests from this IP, please try again later!",
  standardHeaders: true,
  legacyHeaders: false,
});

// POST requests limiter
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // max 20 requests per 15 mins
  message: "Too many POST requests from this IP, please try again later!",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { getLimiter, postLimiter };
