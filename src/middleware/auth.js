import { verifyToken, isTokenBlacklisted, extractToken } from '../utils/jwt';
import { logger } from '../middleware/logger'; // Import the logger

export const authenticate = async (req, res, next) => {
    try {
        const token = await extractToken(req.headers);
        if (!token) {
            logger.info('Authentication failed: Access Denied - No token provided', { statusCode: 401 });
            return res.status(401).send({ message: 'Access Denied' });
        }

        const blacklisted = await isTokenBlacklisted(token);
        if (blacklisted) {
            logger.info('Authentication failed: Token is blacklisted (logged out)', { statusCode: 401 });
            return res.status(401).send({ message: 'You are already logged out' });
        }

        const verified = await verifyToken(token);
        if (!verified) {
            logger.info('Authentication failed: Invalid token', { statusCode: 401 });
            return res.status(401).send({ message: 'Invalid Token' });
        }

        req.user = verified;
        logger.info('Authentication successful', { statusCode: 200 });
        next();
    } catch (error) {
        logger.error(`Authentication error: ${error.message}`, { statusCode: 500 });
        return res.status(500).send({ message: 'Internal Server Error' });
    }
};
