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
   * @param {string} author_name - The nickname of the author.
   * @param {Date} createdAt - The creation date of the journal entry.
   * @param {boolean} isPublic - Indicates if the journal entry is public.
   */
  constructor(title, content, author_id, author_name, createdAt, isPublic) {
    this.title = title;
    this.content = content;
    this.author_id = new ObjectID(author_id);
    this.author_name = author_name;
    this.createdAt = createdAt;
    this.isPublic = isPublic;
  }

  /**
   * Create a new journal entry and save it to the database.
   * @param {string} title - The title of the journal entry.
   * @param {string} content - The content of the journal entry.
   * @param {ObjectID} author_id - The ID of the author.
   * @param {string} author_name - The nickname of the author.
   * @param {boolean} isPublic - Indicates if the journal entry is public.
   * @returns {Promise<Object>} The created journal entry.
   */
  static async createJournalEntry(title, content, author_id, author_name, createdAt, isPublic) {
    console.log('isPublic:', isPublic); // debug line, remember to remove
    const newEntry = new JournalEntry(title, content, author_id, author_name, createdAt, isPublic);
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
   * Update an existing journal entry with a new title, content, and visibility setting.
   * @param {string} entryId - The ID of the journal entry.
   * @param {string} title - The new title of the journal entry.
   * @param {string} content - The new content of the journal entry.
   * @param {boolean} isPublic - Indicates if the journal entry is public.
   * @returns {Promise<Object|null>} The updated journal entry, or null if not found.
   * @throws {Error} Will throw an error if the ID is invalid.
   */
  static async updateJournalEntry(entryId, title, content, isPublic) {
    if (!ObjectID.isValid(entryId)) {
      throw new Error('Invalid ID');
    }
     // Prepare the update object with only the fields that are provided
     const updateData = {};
     if (title !== undefined) updateData.title = title;
     if (content !== undefined) updateData.content = content;
     if (isPublic !== undefined) updateData.isPublic = isPublic;

    const updatedEntry = await dbClient.db.collection('journal_entries').findOneAndUpdate(
      { _id: new ObjectID(entryId) },
      { $set: updateData },
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
    return result.deletedCount > 0;
  }

  /**
   * Retrieve all journal entries with a public visibility setting.
   * @returns {Promise<Array>} The list of public journal entries.
   */
  static async getPublicJournalEntries() {
    const entries = await dbClient.db.collection('journal_entries').find({ isPublic: true }).toArray();
    return entries;
  }
}

export default JournalEntry;
