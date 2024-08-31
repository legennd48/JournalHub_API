import rateLimit from 'express-rate-limit';

export const requestRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per windowMs
  message: (req) => {
    const currentTime = new Date().toLocaleTimeString();
    const remainingTime = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000);
    if (remainingTime > 0) {
      return `Too many requests from this IP, please try again in ${remainingTime} seconds (current time: ${currentTime}).`;
    } else {
      const nextRequestTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString();
      return `Too many requests from this IP, please try again after ${nextRequestTime} (current time: ${currentTime}).`;
    }
  }
});
