import bcrypt from 'bcryptjs';
import { generateToken, blacklistToken, extractToken, extractTokenExpiration } from '../utils/jwt';
import dbClient from '../utils/db';
import {
    HTTP_STATUS_OK,
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_INTERNAL_SERVER_ERROR,
    HTTP_STATUS_UNAUTHORIZED,
    HTTP_STATUS_NOT_FOUND,
} from '../httpStatusCodes';

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
            // eslint-disable-next-line no-underscore-dangle
            const token = generateToken(user._id.toString(), user.nickname, user.fullName, user.email);
            // Send the token and user ID as a response
            // eslint-disable-next-line no-underscore-dangle
            return res.status(HTTP_STATUS_OK).json({ token, userId: user._id });
        } catch (error) {
            // If there's an error, log it and send a 500 response
            // console.error(error);
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
            // console.error(error);
            return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new AuthController();
