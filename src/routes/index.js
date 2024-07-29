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

// Api Status
router.get('/api/status', AppController.getStatus); // Endpoint to check the status of the application
router.get('/api/stats', (req, res) => AppController.getStats(req, res));
router.get('/api/user/journal-entries/:id', (req, res) => AppController.getUserEntries(req, res));

// User Registration & Authentication
router.post('/api/user/register', registerUser);
router.post('/api/user/login', AuthController.login); // Endpoint to handle user login
router.post('/api/user/logout', authenticate, AuthController.logout); // Endpoint to handle user logout

// Journal Entries
router.post('/api/journal-entries', JournalEntryController.createJournalEntry); // Endpoint to create a new journal entry
router.get('/api/journal-entries/user/:userId', JournalEntryController.getJournalEntriesByUser); // Endpoint to get all journal entries by user ID
router.get('/api/journal-entries/:id', JournalEntryController.getJournalEntryById); // Endpoint to get a journal entry by ID
router.put('/api/journal-entries/:id', JournalEntryController.updateJournalEntry); // Endpoint to update a journal entry by ID
router.delete('/api/journal-entries/:id', JournalEntryController.deleteJournalEntry); // Endpoint to delete a journal entry by ID

// User Profile Management

router.get('/api/user/profile/:userId', authenticate, getUserProfile); // Add authenticate middleware
router.put('/api/user/profile/:userId', authenticate, updateUserProfile); // Add authenticate middleware
router.delete('/api/user/profile/:userId', authenticate, deleteUserAccount); // Add authenticate middleware

export default router;
