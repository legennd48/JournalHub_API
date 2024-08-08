import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';
import {
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from '../controllers/userController';
import JournalEntryController from '../controllers/journalEntryController';

const router = express.Router();

/**
 * @module routes/index
 * @description Defines the API routes for the application.
 */

// API Status and Statistics
router.get('/api/status', AppController.getStatus); // Check application status
router.get('/api/stats', (req, res) => AppController.getStats(req, res));
router.get('/api/user/:id/journal-entries', (req, res) => AppController.getUserEntries(req, res));

// User Registration & Authentication
router.post('/api/user/register', registerUser); // Register a new user
router.post('/api/user/login', AuthController.login); // Handle user login
router.post('/api/user/logout', authenticate, AuthController.logout); // Handle user logout (requires authentication)

// Journal Entries
router.post('/api/journal-entries', JournalEntryController.createJournalEntry); // Create a new journal entry
router.get('/api/journal-entries/user/:userId', authenticate, JournalEntryController.getJournalEntriesByUser); // Get all journal entries by user ID
router.get('/api/journal-entries/:id', authenticate, JournalEntryController.getJournalEntryById); // Get a journal entry by ID
router.put('/api/journal-entries/:id', authenticate, JournalEntryController.updateJournalEntry); // Update a journal entry by ID
router.delete('/api/journal-entries/:id', authenticate, JournalEntryController.deleteJournalEntry); // Delete a journal entry by ID

// User Profile Management
router.get('/api/user/profile/:userId', authenticate, getUserProfile); // Get user profile (requires authentication)
router.put('/api/user/profile/:userId', authenticate, updateUserProfile); // Update user profile (requires authentication)
router.delete('/api/user/profile/:userId', authenticate, deleteUserAccount); // Delete user account (requires authentication)

export default router;
