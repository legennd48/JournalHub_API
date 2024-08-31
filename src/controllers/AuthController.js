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
                // If user is not found, send a 404 response
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'User not found' });
            }

            // Compare provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                // If password is invalid, send a 400 response
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Invalid credentials' });
            }

            // Generate a JWT token for the user
            const token = generateToken(user._id.toString(), user.nickname, user.fullName, user.email);
            // Send the token and user ID as a response
            return res.status(HTTP_STATUS_OK).json({ token });
        } catch (error) {
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
        // Extract the token from the header
        const token = extractToken(req.headers);
        if (!token) {
            // If the header is missing or doesn't start with 'Bearer ', send a 401 response
            return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Missing or invalid Authorization header' });
        }
        try {
            const expirationDate = await extractTokenExpiration(token);
            if (!expirationDate) {
                // If the token is invalid, send a 400 response
                return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Invalid Token' });
            }
            await blacklistToken(token, expirationDate);
            // Send a success response
            return res.status(HTTP_STATUS_OK).json({ message: 'Logout successful' });
        } catch (error) {
            // If there's an error, log it and send a 500 response
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
            // Find the user in the database by email
            const user = await dbClient.db.collection('users').findOne({ email });
            if (!user) {
                // If user is not found, send a 404 response
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'User not found' });
            }

            // Generate a password reset token for the user
            const token = generatePasswordResetToken(email, user._id);
            // Construct the password reset URL
            const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password?token=${token}`;

            // Send the token to user email
            sendPasswordResetMail(email, resetUrl);
            return res.status(HTTP_STATUS_OK).json({ message: 'Password reset email sent' });
        } catch (error) {
            if (error instanceof Error && error.name === 'RateLimiterRes') {
                return res.status(HTTP_STATUS_TOO_MANY_REQUESTS).json({ message: 'Too many requests. Please try again later.' });
            }
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
            // verify the token
            const result = await verifyToken(token);
            if (!result) {
                // If the token is invalid, send a 400 response
                return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: 'Invalid reset token' });
            }
            const user = await User.findById(result.userId);
            if (!user) {
                // If user is not found, send a 404 response
                return res.status(HTTP_STATUS_NOT_FOUND).json({ message: 'User not found' });
            }
            // Hash the new password
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            // Update the user's password
            await dbClient.db.collection('users').updateOne({ email: user.email }, { $set: { password: hashedPassword } });
            // Send a success email
            sendPasswordChangedMail(user.email);
            // Blacklist the token
            await blacklistToken(token, new Date(result.exp * 1000));
            // Send a success response
            return res.status(HTTP_STATUS_OK).json({ message: 'Password reset successful' });
        } catch (error) {
            // If there's an error send a 500 response
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new AuthController();
