/* eslint-disable class-methods-use-this */
import { MongoClient, ObjectID } from 'mongodb';
import EventEmitter from 'events';

const { MONGO_URI } = process.env; // Url to be set as env variable

class DBClient extends EventEmitter {
  constructor() {
    super();
    this.client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    this.client.connect()
      .then((client) => {
        console.log('MongoDB connected successfully');
        this.db = client.db('journalhub');
        this.emit('connected');
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
        this.emit('error', err);
      });
  }

  isAlive() {
    return !!this.db;
  }

  /**
 * Retrieves the number of users in the database.
 * @returns {Promise<Number>} A promise that resolves to the total number of users.
 */
  async allUsers() {
    try {
      const count = await this.client.db()
        .collection('users')
        .countDocuments();
      return count;
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  }

  /**
 * Retrieves the total number of entries in the database.
 * @returns {Promise<Number>} A promise that resolves to the total number of entries.
 */
  async allEntries() {
    try {
      const count = await this.client.db()
        .collection('journalEntries')
        .countDocuments();
      return count;
    } catch (error) {
      console.error('Error fetching total entries:', error);
    }
  }

  /**
 * Retrieves the total number of entries belonging to a specific user.
 * @param {string} userId The ID of the user whose entries to count.
 * @returns {Promise<number>} A promise that resolves to the total number of entries.
 */
  async allUserEntries(userId) {
    try {
      const count = await this.client.db()
        .collection('journalEntries')
        .countDocuments({ authorId: ObjectID(userId) });
      return count;
    } catch (error) {
      console.error('Error fetching user entries:', error);
    // Handle the error appropriately, e.g., throw a custom error or return a default value
    }
  }

  ObjectID(id) {
    return new ObjectID(id);
  }
}

const dbClient = new DBClient();
dbClient.on('error', (err) => {
  console.error('MongoDB Connection Error:', err);
});

export default dbClient;
