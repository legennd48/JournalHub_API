import bcrypt from 'bcrypt'; // Library for hashing passwords
import User from '../models/User'; // User model for interacting with users
import { extractToken, blacklistToken, extractTokenExpiration } from '../utils/jwt'; // Utility function to extract JWT from request headers
import JournalEntry from '../models/JournalEntry';
import { sendWelcomeMail, sendProfileUpdatedMail, sendPasswordChangedMail, sendAccountDeletedMail } from '../utils/mailer';
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from '../constants/httpStatusCodes';
import dotenv from 'dotenv';
import { logger } from '../middleware/logger'; // Import the logger
dotenv.config();

const saltRounds = parseInt(process.env.SALT_ROUNDS);
if (!saltRounds) {
  throw new Error('SALT_ROUNDS environment variable is not set');
}

/**
 * Registers a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} The response containing the new user ID or an error message.
 */
async function registerUser(req, res) {
  const { fullName, nickname, email, password } = req.body; // Extract user data from request body
  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      logger.info(`Registration failed: User already exists (email: ${email})`, { statusCode: HTTP_STATUS_BAD_REQUEST });
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user instance
    const newUser = new User({ fullName, nickname, email, password: hashedPassword });
    const userId = await newUser.save(); // Save new user to the database

    // Send welcome email
    await sendWelcomeMail(email);
    logger.info(`New user registered successfully (userId: ${userId}, email: ${email})`, { statusCode: HTTP_STATUS_CREATED });

    return res.status(HTTP_STATUS_CREATED).json({ userId }); // Respond with the newly created user's ID
  } catch (error) {
    logger.error(`Registration error: ${error.message}`, { statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR });
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Error Registering new user' }); // Respond with a server error status
  }
}

/**
 * Fetches a user profile by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} The response containing the user profile or an error message.
 */
async function getUserProfile(req, res) {
  const userId = req.user.userId; // Extract userId from authenticated user
  try {
    const user = await User.findById(userId); // Find user by ID in the database
    if (!user) {
      logger.info(`User profile fetch failed: User not found (userId: ${userId})`, { statusCode: HTTP_STATUS_NOT_FOUND });
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'User not found' });
    }

    logger.info(`User profile fetched successfully (userId: ${userId})`, { statusCode: HTTP_STATUS_OK });
    return res.status(HTTP_STATUS_OK).json({ user }); // Respond with the fetched user profile
  } catch (error) {
    logger.error(`Error fetching user profile: ${error.message}`, { statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR });
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Server error' }); // Respond with a server error status
  }
}

/**
 * Updates a user profile by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} The response indicating success or an error message.
 */
async function updateUserProfile(req, res) {
  const userId = req.user.userId; // Extract userId from authenticated user
  const newData = req.body; // Extract updated data from request body
  try {
    const updated = await User.update(userId, newData); // Update user data in the database
    if (!updated) {
      logger.info(`User profile update failed: User not found or no changes applied (userId: ${userId})`, { statusCode: HTTP_STATUS_NOT_FOUND });
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'User not found or no changes applied' });
    }
    sendProfileUpdatedMail((newData.email) ? newData.email : req.user.email); // Send profile updated email
    logger.info(`User profile updated successfully (userId: ${userId})`, { statusCode: HTTP_STATUS_OK });

    return res.status(HTTP_STATUS_OK).json({ message: 'User profile updated successfully' }); // Respond with success message
  } catch (error) {
    logger.error(`User profile update error: ${error.message}`, { statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR });
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Server error' }); // Respond with a server error status
  }
}

/**
 * Deletes a user account by ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} The response indicating success or an error message.
 */
async function deleteUserAccount(req, res) {
  const userId = req.user.userId; // Extract userId from authenticated user
  const email = req.user.email;
  const token = extractToken(req.headers); // Extract token from request headers
  try {
    // Use the JournalEntry class to delete journal entries
    const stat = await JournalEntry.deleteJournalEntriesByUser(userId); // delete all users journal entries
    if (!stat) {
      logger.info(`Delete user account failed: User not found or no journal entries to delete (userId: ${userId})`, { statusCode: HTTP_STATUS_NOT_FOUND });
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'User not found or no journal entries to delete' });
    }
    await User.delete(userId); // Delete user from the database

    const expirationDate = await extractTokenExpiration(token); // Extract token expiration date

    if (!expirationDate) {
      logger.info('Delete user account failed: Invalid token', { statusCode: HTTP_STATUS_BAD_REQUEST });
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ error: 'Invalid Token' });
    }
    await blacklistToken(token, expirationDate); // Blacklist the token used for authentication
    sendAccountDeletedMail(email);
    logger.info(`User account deleted successfully (userId: ${userId})`, { statusCode: HTTP_STATUS_OK });

    return res.status(HTTP_STATUS_OK).json({ message: 'User account deleted successfully' }); // Respond with success message
  } catch (error) {
    logger.error(`Delete user account error: ${error.message}`, { statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR });
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Server error' }); // Respond with a server error status
  }
}

/**
 * Updates a user's password.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} The response indicating success or an error message.
 */
async function updateUserPassword(req, res) {
  const userId = req.user.userId;
  const { password, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      logger.info(`Update password failed: User not found (userId: ${userId})`, { statusCode: HTTP_STATUS_NOT_FOUND });
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.info(`Update password failed: Invalid password (userId: ${userId})`, { statusCode: HTTP_STATUS_UNAUTHORIZED });
      return res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: 'Invalid password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.update(userId, { password: hashedPassword });
    sendPasswordChangedMail(user.email);
    logger.info(`User password updated successfully (userId: ${userId})`, { statusCode: HTTP_STATUS_OK });

    return res.status(HTTP_STATUS_OK).json({ message: 'Password updated successfully' });

  } catch (error) {
    logger.error(`Update password error: ${error.message}`, { statusCode: HTTP_STATUS_INTERNAL_SERVER_ERROR });
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
  }
}

// Export all controller functions as named exports
export {
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  updateUserPassword,
};
