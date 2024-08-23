import bcrypt from 'bcrypt'; // Library for hashing passwords
import User from '../models/User'; // User model for interacting with users
import { extractToken, blacklistToken, extractTokenExpiration } from '../utils/jwt'; // Utility function to extract JWT from request headers
import JournalEntry from '../models/JournalEntry';
import { sendWelcomeMail, sendProfileUpdatedMail } from '../utils/mailer';
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from '../httpStatusCodes';


const saltRounds = 10; // Number of salt rounds for bcrypt hashing

// Controller function to register a new user
async function registerUser(req, res) {
  const { fullName, nickname, email, password } = req.body; // Extract user's fullname, nickname, email, and password from request body
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
    // console.error('Error registering user:', error); // Log any errors during registration
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Server error' }); // Respond with a server error status
  }
}

// Controller function to fetch user profile by ID
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

// Controller function to update user profile by ID
async function updateUserProfile(req, res) {
  const userId = req.user.userId; // Extract userId from authenticated user
  const newData = req.body; // Extract updated data from request body
  console.log(userId, newData);
  try {
    const updated = await User.update(userId, newData); // Update user data in the database
    if (!updated) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'User not found or no changes applied' });
    }
    sendProfileUpdatedMail((newData.email) ? newData.email : req.user.email); // Send profile updated email

    return res.status(HTTP_STATUS_OK).json({ message: 'User profile updated successfully' }); // Respond with success message
  } catch (error) {
    console.error('Error updating user profile:', error); // Log any errors during profile update
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Server error' }); // Respond with a server error status
  }
}

// Controller function to delete user account by ID
async function deleteUserAccount(req, res) {
  const userId = req.user.userId; // Extract userId from authenticated user
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

    return res.status(HTTP_STATUS_OK).json({ message: 'User account deleted successfully' }); // Respond with success message
  } catch (error) {
    // console.error('Error deleting user account:', error); // Log any errors during account deletion
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: 'Server error' }); // Respond with a server error status
  }
}

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

    return res.status(HTTP_STATUS_OK).json({ message: 'Password updated successfully' });

  } catch (error) {
    // console.error('Error updating user password:', error);
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
