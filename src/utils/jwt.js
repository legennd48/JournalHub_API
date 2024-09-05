import jwt from 'jsonwebtoken';
import dbClient from './db';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;


/**
 * Generates a JWT token.
 * @function
 * @param {string} userId - The user ID to include in the token payload.
 * @returns {string} The generated JWT token.
 */
export const generateToken = (userId, nickname, fullName, email) => {
    return jwt.sign({ userId, nickname, fullName, email }, SECRET_KEY, { expiresIn: '8h' });
};

/**
 * Checks if a JWT token is blacklisted.
 * @function
 * @param {string} token - The JWT token to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the token is blacklisted, otherwise false.
 */
export const isTokenBlacklisted = async (token) => {
    const result = await dbClient.db.collection('blacklisted_tokens').findOne({ token });
    if (!result) {
        return false;
    }
    return true;
};

/**
 * Verifies a JWT token.
 * @function
 * @param {string} token - The JWT token to verify.
 * @returns {Object|null} The decoded token if valid and not blacklisted, otherwise null.
 */
export const verifyToken = async (token) => {
    try {
        if (await isTokenBlacklisted(token)) {
            return null;
        }
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
};

/**
 * Blacklists a JWT token by storing it in a db collection.
 * @function
 * @param {string} token - The JWT token to blacklist.
 * @param {Date} expirationDate - The expiration date of the token.
 * @returns {Promise<void>} A promise that resolves when the token is blacklisted.
 */
export const blacklistToken = async (token, expirationDate) => {
    try {
        // Ensure TTL index is set before inserting a document
        // await ensureTTLIndex();

        await dbClient.db.collection('blacklisted_tokens').insertOne({ token, expirationDate });
    } catch (err) {
    }
};

/**
 * Extracts the JWT token from the request headers.
 * @function
 * @param {Object} headers - The request headers.
 * @returns {string|null} The extracted JWT token if present, otherwise null.
 */
export const extractToken = (headers) => {
    const authHeader = headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7, authHeader.length);
        return token;
    }
    return null;
};

/**
 * Decodes and calculates the expiration date of a JWT token.
 * @function
 * @param {string} token - The JWT token to extract the expiration date from.
 * returns {Date|null} The expiration date of the token if valid, otherwise null.
 */
export const extractTokenExpiration = (token) => {
    try {
        // Decode the token to get its payload
        const decoded = jwt.decode(token);
        if (!decoded) {
            // If the token is invalid, send a 400 response
            return null;
        }

        // Calculate the expiration date and time
        const expirationDate = new Date(decoded.exp * 1000);
        return expirationDate;
    }
    catch (error) {
        return null;
    }
}

/**
 * Generate password reset token
 * @function
 * @param {string} email - The user's email address.
 * @returns {string} The generated password reset token.
 */
export const generatePasswordResetToken = (email, userId) => {
    const token = jwt.sign({ email, userId }, SECRET_KEY, { expiresIn: '1h' });
    return token;
}

