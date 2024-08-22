import JournalEntry from '../models/JournalEntry';
import { verifyToken, extractToken } from '../utils/jwt';
import {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from '../httpStatusCodes';

const J = JournalEntry; // Alias for JournalEntry model

/**
 * Controller class for handling journal entry operations.
 */
class JournalEntryController {
  /**
   * Create a new journal entry.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The created journal entry.
   */
  static async createJournalEntry(req, res) {
    try {
      const author_id = req.user.userId;
      const author_name = req.user.nickname
      if (!author_id) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: 'Invalid token' });
      }

      const { date, title, content, isPublic } = req.body;
      const createdAt = date ? new Date(date) : new Date();
      const newEntry = await J.createJournalEntry(title, content, author_id, author_name, createdAt, isPublic);

      return res.status(HTTP_STATUS_CREATED).json(newEntry);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  /**
   * Retrieve all journal entries associated with a specific user.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Array>} The list of journal entries.
   */
  static async getJournalEntriesByUser(req, res) {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: 'Token is missing or invalid' });
      }

      const entries = await J.getJournalEntriesByUser(userId);
      return res.status(HTTP_STATUS_OK).json(entries);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  /**
   * Retrieve a journal entry by its ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The journal entry.
   */
  static async getJournalEntryById(req, res) {
    if (!verifyToken(extractToken(req.headers))) {
      return res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: 'Access Denied' });
    }
    try {
      const entry = await J.getJournalEntryById(req.params.id);
      if (!entry) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Journal Entry not found' });
      }
      return res.status(HTTP_STATUS_OK).json(entry);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  /**
   * Update an existing journal entry with new title and content.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The updated journal entry.
   */
  static async updateJournalEntry(req, res) {
    if (!verifyToken(extractToken(req.headers))) {
      return res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: 'Access Denied' });
    }
    try {
      const { title, content, isPublic=false } = req.body;
      const updatedEntry = await J.updateJournalEntry(req.params.id, title, content, isPublic);
      if (!updatedEntry) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Journal Entry not found' });
      }
      return res.status(HTTP_STATUS_OK).json(updatedEntry);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  /**
   * Delete a journal entry.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async deleteJournalEntry(req, res) {
    if (!verifyToken(extractToken(req.headers))) {
      return res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: 'Access Denied' });
    }
    try {
      const success = await J.deleteJournalEntry(req.params.id);
      if (!success) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: 'Journal Entry not found' });
      }
      return res.status(HTTP_STATUS_OK).end('Journal Entry deleted successfully');
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  /**
   * Get all public journal entries.
   * @returns {Promise<Array>} The list of public journal entries.
   */
  static async getPublicJournalEntries(req, res) {
    try {
      const entries = await J.getPublicJournalEntries();
      return res.status(HTTP_STATUS_OK).json(entries);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

  /**
   * Search for journal entries by title or content.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object
   * @returns {Promise<Array>} The list of journal entries that match the search query.
   */
  static async searchJournalEntries(req, res) {
    try {
      const userId = req.user.userId;
      const query = req.query.q;

      if (!userId) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({ error: 'Token is missing or invalid' });
      }

      if (!query) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: 'Search query is required' });
      }

      const entries = await J.searchJournal(userId, query);
      return res.status(HTTP_STATUS_OK).json(entries);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}

export default JournalEntryController;
