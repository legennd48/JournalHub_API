const MongoClient = require('mongodb').MongoClient;

const MONGO_URI = 'mongodb://localhost:27017'; // Replace with your connection string
const DB_NAME = 'journalhub'; // Replace with your database name
const USER_DATA = {
  email: 'test3@example.com',
  password: '$2b$10$g0/X7CMo8UCj2.1XDOU4R.Md2oOrsZTi9s1Ptv4SnyLdoCVoQaWMK', // Hashed password using bcrypt (replace with your own hashed password)
};

async function seedUser() {
  try {
    const client = await MongoClient.connect(MONGO_URI, { useUnifiedTopology: true });
    const db = client.db(DB_NAME);
    const result = await db.collection('users').insertOne(USER_DATA);
    console.log(`Inserted user with ID: ${result.insertedId}`);
    await client.close();
  } catch (error) {
    console.error(error);
  }
}

seedUser();
