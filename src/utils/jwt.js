import jwt from 'jsonwebtoken';
import dbClient from './db';

const SECRET_KEY = process.env.SECRET_KEY || 'This Is A Secret'; // remember to remove default value

/**
 * Generates a JWT token.
 * @function
 * @param {string} userId - The user ID to include in the token payload.
 * @returns {string} The generated JWT token.
 */
export const generateToken = (userId) => {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '8h' });
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
 * @param {number} expirationDate - The expiration date of the token.
 * @returns {Promise<void>} A promise that resolves when the token is blacklisted.
 */
export const blacklistToken = (token, expirationDate) => {
    return dbClient.db.collection('blacklisted_tokens').insertOne({ token, expirationDate })
        .then(() => {
            console.log('Token blacklisted successfully');
        })
        .catch((err) => {
            console.error('Error blacklisting token:', err);
        });
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
 * Extracts the JWT token from the request headers.
 * @function
 * @param {Object} headers - The request headers.
 * @returns {string|null} The extracted JWT token if present, otherwise null.
 */
export const extractToken = (headers) => {
    const authHeader = headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7, authHeader.length);
        console.log('Token extracted:', token); // debug line, remember to remove
        return token;
    }
    return null;
};
/**
 * Extract the user Id from a JWT token extrcted from the req header.
 * @function
 * @param {string} token - The token to extract the user ID from.
 * @returns {string|null} The extracted user ID if present, otherwise null.
 */
// export const extractUserId = (token) => {
//     if (verifyToken(token)) {
//         const decoded = jwt.decode(token);
//         console.log('Decoded token:', decoded.userId); // debug line, remember to remove
//         return decoded ? decoded.userId : null;
//     }
//     return null;
// }
