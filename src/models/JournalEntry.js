import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';

/**
 * Class representing a journal entry.
 */
class JournalEntry {
  /**
   * Create a journal entry.
   * @param {string} title - The title of the journal entry.
   * @param {string} content - The content of the journal entry.
   * @param {ObjectID} author_id - The ID of the author.
   * @param {Date} [createdAt=new Date()] - The creation date of the journal entry.
   */
  constructor(title, content, author_id, author_nickname, createdAt = new Date()) {
    this.title = title;
    this.content = content;
    this.author_id = new ObjectID(author_id);
    this.author_name = author_nickname;
    this.createdAt = createdAt;
  }

  /**
   * Create a new journal entry and save it to the database.
   * @param {string} title - The title of the journal entry.
   * @param {string} content - The content of the journal entry.
   * @param {ObjectID} author_id - The ID of the author.
   * @returns {Promise<Object>} The created journal entry.
   */
  static async createJournalEntry(title, content, author_id, author_name) {
    const newEntry = new JournalEntry(title, content, author_id, author_name);
    const result = await dbClient.db.collection('journal_entries').insertOne(newEntry);
    return result.ops[0];
  }

  /**
   * Retrieve all journal entries associated with a specific user.
   * @param {ObjectID} userId - The ID of the user.
   * @returns {Promise<Array>} The list of journal entries.
   */
  static async getJournalEntriesByUser(userId) {
    const entries = await dbClient.db.collection('journal_entries').find({ author_id: new ObjectID(userId) }).toArray();
    return entries;
  }

  /**
   * Retrieve a journal entry by its ID.
   * @param {string} id - The ID of the journal entry.
   * @returns {Promise<Object|null>} The journal entry, or null if not found.
   * @throws {Error} Will throw an error if the ID is invalid.
   */
  static async getJournalEntryById(id) {
    if (!ObjectID.isValid(id)) {
      throw new Error('Invalid ID');
    }
    const entry = await dbClient.db.collection('journal_entries').findOne({ _id: new ObjectID(id) });
    return entry;
  }

  /**
   * Update an existing journal entry with new title and content.
   * @param {string} entryId - The ID of the journal entry.
   * @param {string} title - The new title of the journal entry.
   * @param {string} content - The new content of the journal entry.
   * @returns {Promise<Object|null>} The updated journal entry, or null if not found.
   * @throws {Error} Will throw an error if the ID is invalid.
   */
  static async updateJournalEntry(entryId, title, content) {
    if (!ObjectID.isValid(entryId)) {
      throw new Error('Invalid ID');
    }
    const updatedEntry = await dbClient.db.collection('journal_entries').findOneAndUpdate(
      { _id: new ObjectID(entryId) },
      { $set: { title, content } },
      { returnDocument: 'after' }
    );
    return updatedEntry.value;
  }

  /**
   * Delete a journal entry from the database.
   * @param {string} entryId - The ID of the journal entry.
   * @returns {Promise<boolean>} True if the journal entry was deleted, false otherwise.
   * @throws {Error} Will throw an error if the ID is invalid.
   */
  static async deleteJournalEntry(entryId) {
    if (!ObjectID.isValid(entryId)) {
      throw new Error('Invalid ID');
    }
    const result = await dbClient.db.collection('journal_entries').deleteOne({ _id: new ObjectID(entryId) });
    return result.deletedCount > 0;
  }

  /**
  * Delete all journal entries associated with a specific user.
  * @param {string} userId - The ID of the user.
  * @returns {Promise<boolean>} True if the journal entries were deleted, false otherwise.
  * @throws {Error} Will throw an error if the ID is invalid.
  */
  static async deleteJournalEntriesByUser(userId) {
    if (!ObjectID.isValid(userId)) {
      throw new Error('Invalid ID');
    }
    const result = await dbClient.db.collection('journal_entries').deleteMany({ author_id: new ObjectID(userId) });
    if (result) {
      return true;
    }
    return false;
  }
}

export default JournalEntry;
