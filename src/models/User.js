// Importing the database client utility
import dbClient from '../utils/db';
// Constant for the collection name in the database
const USERS_COLLECTION = 'users';

// User class definition
class User {
  // Constructor method for initializing user properties
  constructor({
    name,
    email,
    password,
    role = 'user',
    isPrivate = false,
  }) {
    // Generate a new ObjectID for user identification
    this.name = name; // User's name
    this.email = email; // User's email
    this.password = password; // User's hashed password
    this.role = role; // User's role (default is 'user')
    this.isPrivate = isPrivate; // Flag indicating if user profile is private
  }

  // Method to save the user instance to the database
  async save() {
    const { db } = dbClient; // Destructure db from dbClient
    // Insert the current user instance into the 'users' collection
    const result = await db.collection(USERS_COLLECTION).insertOne(this);
    return result.insertedId; // Return the inserted document ID
  }

  // Static method to find a user by their email
  static async findByEmail(email) {
    const { db } = dbClient; // Destructure db from dbClient
    // Find and return the user document matching the provided email
    return db.collection(USERS_COLLECTION).findOne({ email });
  }

  // Static method to find a user by their ID
  static async findById(id) {
    const { db } = dbClient; // Destructure db from dbClient
    // Find and return the user document matching the provided ID
    return db.collection(USERS_COLLECTION).findOne({ _id: dbClient.ObjectID(id) });
  }

  // Static method to update a user's data by their ID
  static async update(id, newData) {
    const { db } = dbClient; // Destructure db from dbClient
    // Update the user document with the provided ID using the new data
    const result = await db.collection(USERS_COLLECTION).updateOne(
      { _id: dbClient.ObjectID(id) },
      { $set: newData },
    );
    return result.modifiedCount > 0; // Return true if the document was updated successfully
  }

  // Static method to delete a user by their ID
  static async delete(id) {
    const { db } = dbClient; // Destructure db from dbClient
    // Delete the user document matching the provided ID
    const result = await db.collection(USERS_COLLECTION).deleteOne({ _id: dbClient.ObjectID(id) });
    return result.deletedCount > 0; // Return true if the document was deleted successfully
  }
}

export default User; // Export the User class as the default export
