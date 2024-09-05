import { HTTP_STATUS_BAD_REQUEST } from '../constants/httpStatusCodes';
import { logger } from '../middleware/logger'; // Import the logger

/**
 * Middleware to validate incoming requests using Joi schema.
 * @param {Object} schema - Joi validation schema for the request.
 * @param {string} property - Property of request to validate (e.g., 'body', 'query', 'params').
 */
export const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (error) {
      logger.info(`Validation failed: ${error.details[0].message}`, { statusCode: HTTP_STATUS_BAD_REQUEST });
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: error.details[0].message });
    }
    logger.info('Validation successful', { statusCode: 200 });
    next();
  };
};
