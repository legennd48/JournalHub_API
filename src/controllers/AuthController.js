import bcrypt from 'bcryptjs';
import dbClient from '../utils/db';
import User from '../models/User';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { sendPasswordResetMail, sendPasswordChangedMail } from '../utils/mailer';
import {
    HTTP_STATUS_OK,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_UNAUTHORIZED,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_TOO_MANY_REQUESTS,
} from '../constants/httpStatusCodes';
import {
    generateToken,
    blacklistToken,
    extractToken,
    extractTokenExpiration,
    verifyToken,
    generatePasswordResetToken
} from '../utils/jwt';
import dotenv from 'dotenv';
import { logger } from '../middleware/logger';

dotenv.config();

const saltRounds = parseInt(process.env.SALT_ROUNDS);
if (!saltRounds) {
    throw new Error('SALT_ROUNDS environment variable is not set');
}

const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60 * 15,
});

/**
 * @class AuthController
 * @classdesc Controller for handling authentication-related operations.
 */
class AuthController {
    /**
     * Handles user login.
     * @async
     * @method
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<void>}
     */
    async login(req, res) {
        const { email, password } = req.body;

        try {
            // Find the user in the database by email
            const user = await dbClient.db.collection('users').findOne({ email });
            if (!user) {
                logger.info(`Login failed: User not found (email: ${email})`, { statusCode: HTTP_STATUS_NOT_FOUND });
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'User not found' });
            }

            // Compare provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                logger.info(`Login failed: Invalid credentials (email: ${email})`, { statusCode: HTTP_STATUS_BAD_REQUEST });
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Invalid credentials' });
            }

            // Generate a JWT token for the user
            const token = generateToken(user._id.toString(), user.nickname, user.fullName, user.email);
            logger.info(`User login successful (email: ${email})`, { statusCode: HTTP_STATUS_OK });

            // Send the token and user ID as a response
            return res.status(HTTP_STATUS_OK).json({ token });
        } catch (error) {
            logger.error(`Login error: ${error.message}`, { statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR });
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles user logout.
     * @async
     * @method
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<void>}
     */
    async logout(req, res) {
        const token = extractToken(req.headers);
        if (!token) {
            logger.info('Logout failed: Missing or invalid Authorization header', { statusCode: HTTP_STATUS_UNAUTHORIZED });
            return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Missing or invalid Authorization header' });
        }
        try {
            const expirationDate = await extractTokenExpiration(token);
            if (!expirationDate) {
                logger.info('Logout failed: Invalid token', { statusCode: HTTP_STATUS_BAD_REQUEST });
                return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Token' });
            }
            await blacklistToken(token, expirationDate);
            logger.info('User logout successful', { statusCode: HTTP_STATUS_OK });

            return res.status(HTTP_STATUS_OK).json({ message: 'Logout successful' });
        } catch (error) {
            logger.error(`Logout error: ${error.message}`, { statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR });
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles user password reset request.
     * @async
     * @method
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<void>}
     */
    async requestPasswordReset(req, res) {
        const { email } = req.body;
        const ip = req.ip;

        try {
            await rateLimiter.consume(ip);
            const user = await dbClient.db.collection('users').findOne({ email });
            if (!user) {
                logger.info(`Password reset request failed: User not found (email: ${email})`, { statusCode: HTTP_STATUS_NOT_FOUND });
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'User not found' });
            }

            const token = generatePasswordResetToken(email, user._id);
            const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${token}`;

            sendPasswordResetMail(email, resetUrl);
            logger.info(`Password reset email sent (email: ${email})`, { statusCode: HTTP_STATUS_OK });
            return res.status(HTTP_STATUS_OK).json({ message: 'Password reset email sent' });
        } catch (error) {
            if (error instanceof Error && error.name === 'RateLimiterRes') {
                logger.info(`Password reset request rate limited (IP: ${ip})`, { statusCode: HTTP_STATUS_TOO_MANY_REQUESTS });
                return res.status(HTTP_STATUS_TOO_MANY_REQUESTS).json({ message: 'Too many requests. Please try again later.' });
            }
            logger.error(`Password reset request error: ${error.message}`, { statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR });
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles user password reset.
     * @async
     * @method
     * @param {Object} req - Express request object.
     * @param {Object} res - Express response object.
     * @returns {Promise<void>}
     */
    async resetPassword(req, res) {
        const { token } = req.query;
        const { password } = req.body;

        try {
            const result = await verifyToken(token);
            if (!result) {
                logger.info('Password reset failed: Invalid reset token', { statusCode: HTTP_STATUS_BAD_REQUEST });
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Invalid reset token' });
            }
            const user = await User.findById(result.userId);
            if (!user) {
                logger.info(`Password reset failed: User not found (userId: ${result.userId})`, { statusCode: HTTP_STATUS_NOT_FOUND });
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'User not found' });
            }

            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await dbClient.db.collection('users').updateOne({ email: user.email }, { $set: { password: hashedPassword } });

            sendPasswordChangedMail(user.email);
            logger.info(`Password reset successful (email: ${user.email})`, { statusCode: HTTP_STATUS_OK });

            await blacklistToken(token, new Date(result.exp * 1000));
            return res.status(HTTP_STATUS_OK).json({ message: 'Password reset successful' });
        } catch (error) {
            logger.error(`Password reset error: ${error.message}`, { statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR });
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new AuthController();
