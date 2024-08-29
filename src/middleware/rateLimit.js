import rateLimit from 'express-rate-limit';

export const requestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: (req) => {
    const currentTime = new Date().toLocaleTimeString();
    const nextRequestTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString();
    return `Too many requests from this IP, please try again after ${nextRequestTime} (current time: ${currentTime}).`;
  }
});
