// Importing the database client utility
import dbClient from '../utils/db';
// Constant for the collection name in the database
const USERS_COLLECTION = 'users';
// base64 encoded default profile picture
const DEFAULT_PROFILE_PIC = 'data:image/jpg;base64, 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';

// User class definition
class User {
  // Constructor method for initializing user properties
  constructor({
    fullName,
    nickname,
    email,
    password,
    profilePic = DEFAULT_PROFILE_PIC,
    role = 'user',
    isPrivate = false,
  }) {
    // Assign the provided values to the user instance properties
    this.fullName = fullName; // User's name
    this.nickname = nickname; // User's nickname
    this.email = email; // User's email
    this.password = password; // User's hashed password
    this.profilePic = profilePic; // User's profile picture URL (default is empty
    this.role = role; // User's role (default is 'user')
    this.isPrivate = isPrivate; // Flag indicating if user profile is private
  }

  // Method to save the user instance to the database
  async save() {
    const { db } = dbClient; // Destructure db from dbClient
    // Insert the current user instance into the 'users' collection
    const result = await db.collection(USERS_COLLECTION).insertOne(this);
    return result.insertedId; // Return the inserted document ID, nickname, and email
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
