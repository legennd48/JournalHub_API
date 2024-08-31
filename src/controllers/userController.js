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
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user instance
    const newUser = new User({ fullName, nickname, email, password: hashedPassword });
    const userId = await newUser.save(); // Save new user to the database

    // Send welcome email
    await sendWelcomeMail(email);

    return res.status(HTTP_STATUS_CREATED).json({ userId }); // Respond with the newly created user's ID
  } catch (error) {
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
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'User not found' });
    }

    return res.status(HTTP_STATUS_OK).json({ user }); // Respond with the fetched user profile
  } catch (error) {
    // console.error('Error fetching user profile:', error); // Log any errors during profile fetch
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
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'User not found or no changes applied' });
    }
    sendProfileUpdatedMail((newData.email) ? newData.email : req.user.email); // Send profile updated email

    return res.status(HTTP_STATUS_OK).json({ message: 'User profile updated successfully' }); // Respond with success message
  } catch (error) {
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
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'User not found or no journal entries to delete' });
    }
    await User.delete(userId); // Delete user from the database

    const expirationDate = await extractTokenExpiration(token); // Extract token expiration date

    if (!expirationDate) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ error: 'Invalid Token' });
    }
    await blacklistToken(token, expirationDate); // Blacklist the token used for authentication
    sendAccountDeletedMail(email);

    return res.status(HTTP_STATUS_OK).json({ message: 'User account deleted successfully' }); // Respond with success message
  } catch (error) {
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
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: 'Invalid password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await User.update(userId, { password: hashedPassword });
    sendPasswordChangedMail(user.email);

    return res.status(HTTP_STATUS_OK).json({ message: 'Password updated successfully' });

  } catch (error) {
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
