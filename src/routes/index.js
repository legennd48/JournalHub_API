import express from 'express';
import AppController from '../controllers/AppController';
import AuthController from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';
import {
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  updateUserPassword,
} from '../controllers/userController';
import JournalEntryController from '../controllers/journalEntryController';

const Journal = JournalEntryController; // Alias for JournalEntryController

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
router.post('/api/user/logout', authenticate, AuthController.logout); // Handle user logout
router.post('/request-password-reset', AuthController.requestPasswordReset); // Handle password reset request
router.post('/reset-password', AuthController.resetPassword); // Handle password reset

// Journal Entries
router.get('/api/public/journal-entries', Journal.getPublicJournalEntries); // Get all public journal entries
router.post('/api/journal-entries', authenticate, Journal.createJournalEntry); // Create a new journal entry
router.get('/api/journal-entries/user/', authenticate, Journal.getJournalEntriesByUser); // Get all journal entries by user ID
router.get('/api/journal-entries/:id', authenticate, Journal.getJournalEntryById); // Get a journal entry by ID
router.put('/api/journal-entries/:id', authenticate, Journal.updateJournalEntry); // Update a journal entry by ID
router.delete('/api/journal-entries/:id', authenticate, Journal.deleteJournalEntry); // Delete a journal entry by ID
router.get('/api/search/journal-entries', authenticate, Journal.searchJournalEntries); // Search journal entries

// User Profile Management
router.get('/api/user/profile/', authenticate, getUserProfile); // Get user profile (requires authentication)
router.put('/api/user/profile/', authenticate, updateUserProfile); // Update user profile (requires authentication)
router.delete('/api/user/profile/', authenticate, deleteUserAccount); // Delete user account (requires authentication)
router.put('/api/user/profile/password', authenticate, updateUserPassword); // Update user password (requires authentication)

export default router;
