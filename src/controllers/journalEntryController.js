import JournalEntry from '../models/JournalEntry';
import { verifyToken, extractToken } from '../utils/jwt';

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
      const token = extractToken(req.headers);
      if (!token) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const decoded = await verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const authorId = req.headers['userid']; // Corrected to 'userid' instead of 'userId'
      if (!authorId || authorId !== decoded.userId) {
        return res.status(401).json({ error: 'Invalid authorId' });
      }

      const { date, title, content } = req.body;
      const createdAt = date ? new Date(date) : new Date();
      const newEntry = await JournalEntry.createJournalEntry(title, content, authorId, createdAt);

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
      const userId = req.header('userid'); // Corrected to 'userid'
      if (!userId) {
        return res.status(401).json({ error: 'User ID header is missing' });
      }

      const entries = await JournalEntry.getJournalEntriesByUser(userId);
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
    try {
      const entry = await JournalEntry.getJournalEntryById(req.params.id);
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
    try {
      const { title, content } = req.body;
      const updatedEntry = await JournalEntry.updateJournalEntry(req.params.id, title, content);
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
    try {
      const success = await JournalEntry.deleteJournalEntry(req.params.id);
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
