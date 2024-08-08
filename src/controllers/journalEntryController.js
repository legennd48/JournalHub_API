import JournalEntry from '../models/JournalEntry';
import { verifyToken, extractToken, extractUserId } from '../utils/jwt';

const J = JournalEntry;

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
      const authorId = extractUserId(req.headers);
      if (!authorId) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const { date, title, content } = req.body;
      const createdAt = date ? new Date(date) : new Date();
      const newEntry = await J.createJournalEntry(title, content, authorId, createdAt);

      res.status(201).json(newEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
      const userId = extractUserId(req.headers);
      if (!userId) {
        return res.status(401).json({ error: 'Token is missing or invalid' });
      }

      const entries = await J.getJournalEntriesByUser(userId);
      res.status(200).json(entries);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Retrieve a journal entry by its ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The journal entry.
   */
  static async getJournalEntryById(req, res) {
    if (!(verifyToken(extractToken(req.headers)))) {
      return res.status(401).json({ error: 'Access Denied' });
    }
    try {
      const entry = await J.getJournalEntryById(req.params.id);
      if (!entry) {
        return res.status(404).json({ error: 'Journal Entry not found' });
      }
      res.status(200).json(entry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update an existing journal entry with new title and content.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<Object>} The updated journal entry.
   */
  static async updateJournalEntry(req, res) {
    if (!(verifyToken(extractToken(req.headers)))) {
      return res.status(401).json({ error: 'Access Denied' });
    }
    try {
      const { title, content } = req.body;
      const updatedEntry = await J.updateJournalEntry(req.params.id, title, content);
      if (!updatedEntry) {
        return res.status(404).json({ error: 'Journal Entry not found' });
      }
      res.status(200).json(updatedEntry);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete a journal entry.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  static async deleteJournalEntry(req, res) {
    if (!(verifyToken(extractToken(req.headers)))) {
      return res.status(401).json({ error: 'Access Denied' });
    }
    try {
      const success = await J.deleteJournalEntry(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Journal Entry not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default JournalEntryController;
