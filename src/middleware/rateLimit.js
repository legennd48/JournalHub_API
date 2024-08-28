import rateLimit from 'express-rate-limit';

export const requestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
