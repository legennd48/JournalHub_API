import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken, blacklistToken, extractToken } from '../utils/jwt';
import dbClient from '../utils/db';

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
                // If user is not found, send a 400 response
                return res.status(400).json({ message: 'User not found' });
            }

            // Compare provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                // If password is invalid, send a 400 response
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate a JWT token for the user
            const token = generateToken(user._id.toString());
            // Send the token and user ID as a response
            return res.status(200).json({ token, userId: user._id });
        } catch (error) {
            // If there's an error, log it and send a 500 response
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
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
            return res.status(401).send({ message: 'Missing or invalid Authorization header' });
        }
    
        try {
            // Decode the token to get its payload
            const decoded = jwt.decode(token);
            if (!decoded) {
                // If the token is invalid, send a 400 response
                return res.status(400).json({ message: 'Invalid token' });
            }

            // Calculate the time until the token expires
            const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
            // Blacklist the token to prevent further use
            await blacklistToken(token, expiresIn);
            // Send a success response
            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            // If there's an error, log it and send a 500 response
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new AuthController();
