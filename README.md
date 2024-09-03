# JournalHub API

**Empower Your Journaling with JournalHub API**

JournalHub API serves as the backend core for both web and mobile journaling applications. It provides essential functionalities such as user management, secure authentication, journal entry management, and more, through a set of RESTful endpoints.

## Table of Contents
1. [Introduction](#introduction)
2. [Core Features](#core-features)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [API Endpoints](#api-endpoints)
8. [Testing](#testing)
9. [Contribution](#contribution)
10. [License](#license)
11. [Contact](#contact)

## Introduction

JournalHub API is designed to be the central hub for journaling applications, offering robust and scalable endpoints for managing user accounts, journal entries, and application-wide settings. This API is intended to be used by client applications, including web and mobile platforms, that require a reliable and secure backend service for journaling.

## Core Features

- **User Authentication & Authorization**: Secure user registration, login, and session management using JWT.
- **Journal Entries Management**: CRUD operations for journal entries, with options to mark entries as public or private.
- **Search Functionality**: Full-text search across journal entries.
- **Email Notifications**: Automatic email notifications for user registration, profile updates, and password changes.
- **Rate Limiting & Security**: Built-in rate limiting to protect against abuse and secure password storage using bcrypt.
- **Token Blacklisting**: Ensures secure logout and session invalidation by blacklisting JWTs.
- **Statistics**: API endpoints to fetch application statistics, including user and journal entry counts.
- **Logging and Monitoring**: Comprehensive logging and monitoring for tracking application performance and issues.

## Technology Stack

- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for creating RESTful APIs.
- **MongoDB**: NoSQL database for storing user and journal data.
- **Mongoose**: ODM for MongoDB, managing data relationships and schema validation.
- **JWT**: JSON Web Tokens for secure user authentication.
- **bcrypt**: Library for hashing user passwords.
- **Nodemailer**: Library for sending emails.
- **dotenv**: Module to load environment variables from a `.env` file.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14.x or higher)
- **MongoDB** (Local instance or MongoDB Atlas)

### Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/JournalHub-API.git
    cd JournalHub-API
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory with the following variables:
    ```env
    MONGO_URI=your_mongodb_uri
    DB_NAME=your_database_name
    SECRET_KEY=your_jwt_secret
    SALT_ROUNDS=number_of_salt_rounds
    EMAIL=your_email_address
    PASSWORD=your_email_password
    PORT=your_port_number
    ```

4. **Database Initialization**:
    Run the `setupDb.js` script to set up necessary indexes in MongoDB, including TTL (Time to Live) indexes.
    ```bash
    node setupDb.js
    ```

5. **Start the Server**:
    ```bash
    npm start
    ```

    The API will be available at `http://localhost:<PORT>`.

## Environment Variables

The following environment variables need to be configured:

- **MONGO_URI**: Connection string for MongoDB.
- **DB_NAME**: Name of the MongoDB database.
- **SECRET_KEY**: Secret key used for JWT signing.
- **SALT_ROUNDS**: Number of rounds for bcrypt password hashing.
- **EMAIL**: SMTP email address for sending notifications.
- **PASSWORD**: Password for the SMTP email account.
- **PORT**: The port number on which the API will run.

## Database Setup

### Initial Setup

To ensure the API functions correctly, you must set up the MongoDB database, including creating indexes for TTL on certain collections (like blacklisted tokens). The provided `setupDb.js` script automates this setup:

```bash
node setupDb.js
```

This script ensures that necessary indexes are created, particularly for handling token expiration and other time-sensitive data.

## API Endpoints

The JournalHub API offers a variety of endpoints to manage users, journal entries, and application statistics. Below are some key endpoints. For the full documentation, refer to the [API Documentation](./API_DOCUMENTATION.md).

### User Management

- **Register a User**: 
    ```
    POST /api/user/register
    ```
    Registers a new user with full name, nickname, email, and password.

- **Login**: 
    ```
    POST /api/user/login
    ```
    Authenticates a user and returns a JWT for session management.

- **Get User Profile**: 
    ```
    GET /api/user/profile
    ```
    Retrieves the authenticated user's profile.

- **Update User Profile**: 
    ```
    PUT /api/user/profile
    ```
    Updates the authenticated user's profile information.

- **Delete User Account**: 
    ```
    DELETE /api/user/profile
    ```
    Deletes the authenticated user's account, including all journal entries.

### Journal Management

- **Create a Journal Entry**: 
    ```
    POST /api/journal-entries
    ```
    Creates a new journal entry.

- **Get Journal Entries**: 
    ```
    GET /api/journal-entries/user
    ```
    Retrieves all journal entries for the authenticated user.

- **Update a Journal Entry**: 
    ```
    PUT /api/journal-entries/:id
    ```
    Updates an existing journal entry by its ID.

- **Delete a Journal Entry**: 
    ```
    DELETE /api/journal-entries/:id
    ```
    Deletes a journal entry by its ID.

- **Search Journal Entries**: 
    ```
    GET /api/search/journal-entries
    ```
    Searches through the user's journal entries.

### Application Statistics

- **Get API Status**: 
    ```
    GET /api/status
    ```
    Retrieves the current status of the API, including database connection status.

- **Get Application Statistics**: 
    ```
    GET /api/stats
    ```
    Retrieves key statistics, such as the total number of users and journal entries in the system.

- **Get User's Journal Entries Statistics**: 
    ```
    GET /api/user/:id/journal-entries
    ```
    Retrieves the count of journal entries for a specific user by their ID.

## Testing

JournalHub API includes a suite of unit and integration tests to ensure the stability and reliability of the codebase.

### Running Tests

To run the tests, use the following command:

```bash
npm test
```

For more detailed tests, including specific tests for user management, journal entries, and other utilities, refer to the `__tests__` directory.

### Debugging Tests

If you encounter issues with open handles during tests, use:

```bash
npx jest --detectOpenHandles
```

This command helps identify asynchronous operations that might be keeping the process open after tests complete.

## Contribution

We welcome contributions to the JournalHub API! To contribute:

1. **Fork the repository**:
    ```bash
    git fork https://github.com/legennd48/JournalHub_API.git
    cd JournalHub-API
    ```

2. **Create a new branch**:
    ```bash
    git checkout -b feature-branch
    ```

3. **Make your changes and commit**:
    ```bash
    git add .
    git commit -m "Description of your changes"
    ```

4. **Push to your forked repository**:
    ```bash
    git push origin feature-branch
    ```

5. **Open a Pull Request**:
    Go to the original repository and open a pull request with a detailed description of your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact

For any questions or issues, please contact:

- **Abdulrazzaq Liasu** - [GitHub](https://github.com/legennd48)

---
