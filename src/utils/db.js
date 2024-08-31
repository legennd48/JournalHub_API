// /* eslint-disable class-methods-use-this */
import { MongoClient, ObjectID } from 'mongodb';
import EventEmitter from 'events';
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI } = process.env; // Url to be set in .env file

class DBClient extends EventEmitter {
  constructor() {
    super();
    this.client = new MongoClient(MONGO_URI, { useUnifiedTopology: true });
    this.client.connect()
      .then((client) => {
        this.db = client.db(process.env.DB_NAME);
        this.emit('connected');
      })
      .catch((err) => {
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
      throw new Error('Error fetching user count:', error);
    }
  }

  /**
 * Retrieves the total number of entries in the database.
 * @returns {Promise<Number>} A promise that resolves to the total number of entries.
 */
  async allEntries() {
    try {
      const count = await this.client.db()
        .collection('journal_entries')
        .countDocuments();
      return count;
    } catch (error) {
      throw new Error('Error fetching entry count:', error);
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
        .collection('journal_entries')
        .countDocuments({ authorId: ObjectID(userId) });
      return count;
    } catch (error) {
      throw new Error('Error fetching user entry count:', error);
    }
  }

  ObjectID(id) {
    return new ObjectID(id);
  }
}

const dbClient = new DBClient();
dbClient.on('error', (err) => {
  throw new Error('Something Went Wrong With MongoDb Connection:', err);
});

export default dbClient;
