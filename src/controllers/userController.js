import bcrypt from 'bcrypt'; // Library for hashing passwords
import User from '../models/User'; // User model for interacting with users

const saltRounds = 10; // Number of salt rounds for bcrypt hashing

// Controller function to register a new user
async function registerUser(req, res) {
  const { name, email, password } = req.body; // Extract name, email, and password from request body
  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user instance
    const newUser = new User({ name, email, password: hashedPassword });
    const userId = await newUser.save(); // Save new user to the database

    res.status(201).json({ userId }); // Respond with the newly created user's ID
  } catch (error) {
    console.error('Error registering user:', error); // Log any errors during registration
    res.status(500).json({ error: 'Server error' }); // Respond with a server error status
  }
}

// Controller function to fetch user profile by ID
async function getUserProfile(req, res) {
  const { userId } = req.params; // Extract userId from request parameters
  try {
    const user = await User.findById(userId); // Find user by ID in the database
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user }); // Respond with the fetched user profile
  } catch (error) {
    console.error('Error fetching user profile:', error); // Log any errors during profile fetch
    res.status(500).json({ error: 'Server error' }); // Respond with a server error status
  }
}

// Controller function to update user profile by ID
async function updateUserProfile(req, res) {
  const { userId } = req.params; // Extract userId from request parameters
  const newData = req.body; // Extract updated data from request body
  try {
    const updated = await User.update(userId, newData); // Update user data in the database
    if (!updated) {
      return res.status(404).json({ error: 'User not found or no changes applied' });
    }

    res.status(200).json({ message: 'User profile updated successfully' }); // Respond with success message
  } catch (error) {
    console.error('Error updating user profile:', error); // Log any errors during profile update
    res.status(500).json({ error: 'Server error' }); // Respond with a server error status
  }
}

// Controller function to delete user account by ID
async function deleteUserAccount(req, res) {
  const { userId } = req.params; // Extract userId from request parameters
  try {
    const deleted = await User.delete(userId); // Delete user from the database
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User account deleted successfully' }); // Respond with success message
  } catch (error) {
    console.error('Error deleting user account:', error); // Log any errors during account deletion
    res.status(500).json({ error: 'Server error' }); // Respond with a server error status
  }
}

// Export all controller functions as named exports
export {
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
};
