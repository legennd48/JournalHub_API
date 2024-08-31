const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'journalhub';

async function setupDatabase() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    if (!collections.some(c => c.name === 'blacklisted_tokens')) {
      await db.createCollection('blacklisted_tokens');
      console.log('Created blacklisted_tokens collection');
    }
    if (!collections.some(c => c.name === 'journal_entries')) {
      await db.createCollection('journal_entries');
      console.log('Created journal_entries collection');
    }

    // Set up TTL index on blacklisted_tokens
    const blacklistedTokensCollection = db.collection('blacklisted_tokens');
    const blacklistedTokensIndexes = await blacklistedTokensCollection.indexes();
    if (!blacklistedTokensIndexes.some(index => index.name === 'expirationDate_1')) {
      await blacklistedTokensCollection.createIndex(
        { expirationDate: 1 },
        { expireAfterSeconds: 0, unique: true }
      );
      console.log('Created TTL index on blacklisted_tokens.expirationDate');
    }

    // Set up text index on journal_entries
    const journalCollection = db.collection('journal_entries');
    const journalIndexes = await journalCollection.indexes();
    if (!journalIndexes.some(index => /title_text_content_text/.test(index.name))) {
      await journalCollection.createIndex(
        { title: 'text', content: 'text' },
        { name: 'title_text_content_text' }
      );
      console.log('Created text index on journal_entries.title and journal_entries.content');
    }

    console.log('Database setup complete');
  } catch (err) {
    console.error('Error setting up database:', err.message);
  } finally {
    await client.close();
    console.log('Database connection closed');
  }
}

setupDatabase();
