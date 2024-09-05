# JournalHub API Documentation

The JournalHub API is an online journal platform designed to enable users to perform basic journaling functions, such as creating, reading, updating, and deleting (CRUD) their journal entries. It ensures that all journal entries are securely stored in the cloud, providing users with a safe and accessible way to manage their personal or professional journals. The API is intended for use by anyone who wants a simple and reliable journaling tool.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture](#architecture)
   - [Controllers](#controllers)
   - [Models](#models)
   - [Utilities](#utilities)
   - [Middleware](#middleware)
3. [Database](#database)
4. [Security](#security)
5. [Base URL](#base-url)
6. [Authentication](#authentication)
   - [Overview](#overview)
   - [Obtaining a Token](#obtaining-a-token)
   - [Registration](#registration)
   - [Login](#login)
   - [Logout](#logout)
7. [User Management](#user-management)
   - [Get User Profile](#get-user-profile)
   - [Update User Profile](#update-user-profile)
   - [Delete User Account](#delete-user-account)
   - [Update Password](#update-password)
8. [Journal Entries](#journal-entries)
   - [Create Journal Entry](#create-journal-entry)
   - [Get Journal Entries by User ID](#get-journal-entries-by-user-id)
   - [Update Journal Entry](#update-journal-entry)
   - [Delete Journal Entry](#delete-journal-entry)
   - [Get Public Journal Entries](#get-public-journal-entries)
   - [Search Journal Entries](#search-journal-entries)
9. [API Status and Statistics](#api-status-and-statistics)
   - [Get API and MongoDB Status](#get-api-and-mongodb-status)
   - [Get Application Statistics](#get-application-statistics)
   - [Get User Statistics](#get-user-statistics)
10. [Error Handling](#error-handling)
    - [Standard Error Responses](#standard-error-responses)
    - [Common Error Codes](#common-error-codes)
    - [Logging](#logging)
11. [Rate Limiting](#rate-limiting)
    - [Overview](#overview)
    - [Global Rate Limit](#global-rate-limit)
    - [Password Reset Request Limits](#password-reset-request-limits)
12. [Versioning](#versioning)
13. [Security Considerations](#security-considerations)
    - [Data Protection](#data-protection)
    - [Password Storage](#password-storage)
    - [Token Usage](#token-usage)
    - [JWT Security](#jwt-security)
    - [Best Practices for Storing JWTs](#best-practices-for-storing-jwts)
14. [Examples](#examples)
    - [User Registration and Authentication](#user-registration-and-authentication)
    - [User Profile Management](#user-profile-management)
    - [Journal Entries](#journal-entries-examples)
    - [Password Reset](#password-reset)
    - [User Logout and Account Deletion](#user-logout-and-account-deletion)
15. [Code Samples](#code-samples)
    - [User Authentication](#user-authentication)
    - [Journal Entries](#journal-entries-code-samples)
16. [Changelog](#changelog)
17. [Glossary](#glossary)
18. [Contact Information](#contact-information)

---

## Introduction

JournalHub API is an online platform for journaling that allows users to perform CRUD operations on their journal entries while ensuring the security of their data in the cloud.

---

## Architecture

### Controllers

- **App Controller**: Manages the initialization of the application and handles generic routes (e.g., checking API status).
- **JournalEntries Controller**: Handles all operations related to journal entries, including creating, reading, updating, and deleting entries.
- **User Controller**: Manages user-related operations, such as registration, profile management, and account deletion.
- **Auth Controller**: Handles authentication and authorization processes, including user login, token generation, password resets, and token validation.

### Models

- **JournalEntry Model**: Represents the structure of a journal entry within the database, including fields such as title, content, and visibility (public/private).
- **User Model**: Represents user information within the database, including fields such as full name, nickname, email, and password.

### Utilities

- **db.js**: Manages the connection to the MongoDB database.
- **jwt.js**: Provides functions for generating and verifying JSON Web Tokens (JWT).
- **mailer.js**: Handles sending emails, such as welcome emails, password reset instructions, and notifications for changes to user accounts.
- **logger.js**: Implements Winston for logging crucial information and errors to files.

### Middleware

Middleware functions are used throughout the application to handle tasks such as:
- **Validating incoming requests** using Joi schemas.
- **Checking user authentication status** using JWTs.
- **Logging application activity** with Winston and Morgan.
- **Implementing rate limiting** to protect against abuse.

---

## Database

The application uses MongoDB as its primary data store, leveraging its document-based structure to manage user information and journal entries.

---

## Security

Security is a core focus of the JournalHub API. User passwords are hashed using bcrypt before being stored in the database. JWT tokens are used to manage user sessions, ensuring that only authenticated users can access or modify their data.

---

## Base URL

- **Base URL**: `http://localhost:5000/`

---

## Authentication

### Overview

JournalHub uses JWT (JSON Web Token) for authentication. JWT is a secure and stateless authentication mechanism, allowing users to authenticate themselves once and then use the token for subsequent requests without having to re-authenticate.

### Obtaining a Token

To authenticate a user and obtain a JWT, send a POST request to the `/api/user/login` endpoint with the user's credentials (email and password). Upon successful authentication, the server will return a JWT, which must be included in the Authorization header of subsequent requests.

### Registration

- **Endpoint**: `/api/user/register`
- **Method**: POST
- **Request Body**: JSON object containing `fullName`, `nickname`, `email`, and `password`.
- **Response**: Success message or error details.

### Login

- **Endpoint**: `/api/user/login`
- **Method**: POST
- **Request Body**: JSON object containing `email` and `password`.
- **Response**: JWT token or error message.

### Logout

- **Endpoint**: `/api/user/logout`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message or error details.

---

## User Management

### Get User Profile

- **Endpoint**: `/api/user/profile`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User details or error message.

### Update User Profile

- **Endpoint**: `/api/user/profile`
- **Method**: PUT
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: JSON object containing fields to update (`fullName`, `nickname`).
- **Response**: Updated user details or error message.

### Delete User Account

- **Endpoint**: `/api/user/profile`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message or error details.

### Update Password

- **Endpoint**: `/api/user/profile/password`
- **Method**: PUT
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: JSON object containing `password` and `newPassword`.
- **Response**: Success message or error details.

---

## Journal Entries

### Create Journal Entry

- **Endpoint**: `/api/journal-entries`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: JSON object containing `title`, `content`, and `isPublic`.
- **Response**: Created journal entry details or error message.

### Get Journal Entries by User ID

- **Endpoint**: `/api/user/:id/journal-entries`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**: 
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of entries per page (default: 10)
- **Response**: Paginated array of journal entries or error message.

### Update Journal Entry

- **Endpoint**: `/api/journal-entries/:id`
- **Method**: PUT
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: JSON object containing fields to update (`title`, `content`, `isPublic`).
- **Response**: Updated journal entry or error message.

### Delete Journal Entry

- **Endpoint**: `/api/journal-entries/:id`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message or error details.

### Get Public Journal Entries

- **Endpoint**: `/api/public/journal-entries`
- **Method**: GET


- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Number of entries per page (default: 10)
- **Response**: Paginated array of public journal entries or error message.

### Search Journal Entries

- **Endpoint**: `/api/search/journal-entries`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `q` (search term).
- **Response**: Array of matching journal entries or error message.

---

## API Status and Statistics

### Get API and MongoDB Status

- **Endpoint**: `/api/status`
- **Method**: GET
- **Query Params**: No parameters needed.
- **Response**: JSON containing application and database status.

### Get Application Statistics

- **Endpoint**: `/api/stats`
- **Method**: GET
- **Request**: No request body is needed.
- **Response**: JSON containing API statistics (e.g., total users, total journal entries).

### Get User Statistics

- **Endpoint**: `/api/user/:id/journal-entries`
- **Method**: GET
- **Query Parameters**: **id** The ID of the user whose journal entries are to be fetched.
- **Response**: The total number of entries the user has.

---

## Error Handling

The JournalHub API implements comprehensive error handling to ensure that any issues encountered during API requests are communicated effectively to the client. The errors are logged using Winston for further investigation and are returned to the client in a standardized format.

### Error Response Structure

All error responses follow this JSON structure:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Detailed description of the error."
}
```

- **statusCode**: The HTTP status code that represents the error.
- **error**: A brief description of the error type.
- **message**: A more detailed message providing context or specific reasons for the error.

### Types of Errors

1. **Validation Errors**:
   - **Occurs when**: Input data fails validation checks (e.g., missing required fields, incorrect data types).
   - **HTTP Status Code**: `400 Bad Request`
   - **Example**: Missing required fields during journal entry creation.

2. **Authentication Errors**:
   - **Occurs when**: Authentication fails (e.g., missing or invalid token).
   - **HTTP Status Code**: `401 Unauthorized`
   - **Example**: Missing JWT in the Authorization header during a request.

3. **Authorization Errors**:
   - **Occurs when**: A user attempts to access a resource they do not have permissions for.
   - **HTTP Status Code**: `403 Forbidden`
   - **Example**: Attempting to delete another user's journal entry.

4. **Resource Not Found Errors**:
   - **Occurs when**: The requested resource does not exist (e.g., journal entry or user not found).
   - **HTTP Status Code**: `404 Not Found`
   - **Example**: Requesting a journal entry by an ID that does not exist.

5. **Rate Limiting Errors**:
   - **Occurs when**: The rate limit for API requests is exceeded.
   - **HTTP Status Code**: `429 Too Many Requests`
   - **Example**: Exceeding the number of allowed password reset requests.

6. **Server Errors**:
   - **Occurs when**: An unexpected error happens on the server (e.g., database connection issues).
   - **HTTP Status Code**: `500 Internal Server Error`
   - **Example**: An error occurring during user login due to a server-side issue.

### Logging Errors

All critical errors are logged using Winston to ensure that they can be analyzed and addressed. Logged information includes:
- Error type and message
- Relevant request details
- Timestamp of when the error occurred

Error logs are stored in the `error.log` file, and unhandled rejections are logged separately in `rejections.log`.

### **Standard Error Responses**

## Standard Error Responses

The following are common error responses that the JournalHub API might return. Each error is associated with an HTTP status code and a brief explanation of the circumstances under which it occurs.

### 400 Bad Request

- **Description**: The server cannot process the request due to client-side errors.
- **Common Causes**:
  - Invalid or missing parameters in the request body.
  - Data validation failure (e.g., incorrect data type, missing required fields).
- **Example**:
  ```json
  {
    "statusCode": 400,
    "error": "Bad Request",
    "message": "The 'title' field is required."
  }
  ```

### 401 Unauthorized

- **Description**: The client must authenticate itself to get the requested response.
- **Common Causes**:
  - Missing or invalid JWT token in the Authorization header.
  - Expired JWT token.
- **Example**:
  ```json
  {
    "statusCode": 401,
    "error": "Unauthorized",
    "message": "Token is invalid or expired."
  }
  ```

### 403 Forbidden

- **Description**: The client does not have access rights to the content.
- **Common Causes**:
  - User attempting to access a resource they are not permitted to view or modify.
- **Example**:
  ```json
  {
    "statusCode": 403,
    "error": "Forbidden",
    "message": "You do not have permission to access this resource."
  }
  ```

### 404 Not Found

- **Description**: The server cannot find the requested resource.
- **Common Causes**:
  - The requested journal entry or user does not exist in the database.
- **Example**:
  ```json
  {
    "statusCode": 404,
    "error": "Not Found",
    "message": "The requested resource was not found."
  }
  ```

### 429 Too Many Requests

- **Description**: The user has sent too many requests in a given amount of time.
- **Common Causes**:
  - Exceeding the rate limit for API requests.
- **Example**:
  ```json
  {
    "statusCode": 429,
    "error": "Too Many Requests",
    "message": "You have exceeded the number of allowed requests. Please again in 500 seconds."
  }
  ```

### 500 Internal Server Error

- **Description**: The server encountered a situation it doesn't know how to handle.
- **Common Causes**:
  - Unhandled exceptions in the server code.
  - Database connection failures.
- **Example**:
  ```json
  {
    "statusCode": 500,
    "error": "Internal Server Error",
    "message": "An unexpected error occurred. Please try again later."
  }
  ```

---

## Common Error Codes

The JournalHub API uses standard HTTP status codes to indicate the success or failure of a request. Here are the common error codes that you may encounter:

- **Client Error**
  - `400 Bad Request`: The server could not understand the request due to invalid syntax or missing parameters.
  - `401 Unauthorized`: The request requires user authentication.
  - `404 Not Found`: The requested resource could not be found.
  - `429 Too Many Requests`: The user has sent too many requests in a given amount of time.

- **Server Error**
  - `500 Internal Server Error`: An unexpected error occurred on the server.

It is important to handle these error codes appropriately in your application to provide meaningful feedback to the users and handle any potential issues gracefully.


---

## Rate Limiting

### Overview

JournalHub implements rate limiting across all API endpoints to ensure fair usage and protect against abuse.

### Global Rate Limit

- **Limit**: 50 requests per 15-minute window
- **Scope**: Per IP address
- **Application**: This limit applies to all API endpoints.

### Password Reset Request Limits

Users are limited to a certain number of password reset requests within a given time frame. This is designed to prevent automated attacks and reduce the risk of account compromise.
- **Limit**: 5 requests per 1-hour window
- **Scope**: Per user
- **Application**: This limit applies to the user password reset request endpoint.

---

## Versioning

### API Versioning

JournalHub does not currently implement versioning for its API. All requests are handled through the base URL without a version identifier.

### Future Considerations

In the future, API versioning might be introduced to allow for backward compatibility and smoother transitions when updating or deprecating features.

---

## Security Considerations

### Data Protection

JournalHub prioritizes the security of user data, especially sensitive information like passwords.

### Password Storage

All passwords are securely hashed using a strong hashing algorithm before being stored in the database.

### Token Usage

- **Access Tokens**: Generated using JWT, valid for 8 hours, and must be included in the Authorization header of requests to protected endpoints.
- **Password Reset Tokens**: Valid for 1 hour and used exclusively for password reset processes.

### JWT Security

- **Token Expiration**: Access tokens expire after 8 hours, and reset tokens expire after 1 hour.
- **Blacklisting**: Tokens are blacklisted upon user logout or after use for password resets.

### Best Practices for Storing JWTs

- **Store tokens securely**: Use HTTP-only cookies or secure local storage.
- **Avoid exposing tokens**: Ensure tokens are not exposed in URLs or insecure locations.
- **Implement token revocation**: Utilize blacklisting to revoke tokens when necessary.

---

## Examples

This section provides detailed examples of how to use the JournalHub API endpoints using curl commands. These examples demonstrate the typical flow of user interactions with the API.

### User Registration and Authentication

#### Register a New User

```bash
curl -X POST http://localhost:5000/api/user/register \
-H "Content-Type: application/json" \
-d '{
  "fullName": "Jhon Doe",
  "nickname": "jhonney",
  "email": "j_doe@email.com",
  "password": "randomPassword"
}'
```

Response:
```json
{"userId":"66cdb573a4f329c5533e2c02"}
```

#### User Login

```bash
curl -X POST http://localhost:5000/api/user/login \
-H "Content-Type: application/json" \
-d '{
  "email": "j_doe@email.com",
  "password": "randomPassword"
}'
```

Response:
```json
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
```

### User Profile Management

#### Get User Profile

```bash
curl -X GET http://localhost:5000/api/user/profile/ \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{"user":{"_id":"66cdb573a4f329c5533e2c02","fullName":"Jhon Doe","nickname":"jhonney","email":"j_doe@email.com","password":"$2b$10$CYW3Qajew3XRIuGA8qDun.2biOBooLemNeQwlQah3gAN3azc.Tscy","profilePic":"data:image/jpg;base64,...","role":"user","isPrivate":false}}
```

#### Update User Profile

```bash
curl -X PUT http://localhost:5000/api/user/profile/ \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-H "Content-Type: application/json" \
-d '{
  "fullName": "John Q. Doe",
  "nickname": "Johnney Q.",
  "email": "Johnney@email.com"
}'
```

Response:
```json
{"message":"User profile updated successfully"}
```

#### Change Password

```bash
curl -X PUT http://localhost:5000/api/user/profile/password \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-H "Content-Type: application/json" \
-d '{
  "password": "randomPassword",
  "newPassword": "newPassword"
}'
```

Response:
```json
{"message":"Password updated successfully"}
```

### Journal Entries

#### Create a New Journal Entry

```bash
curl -X POST http://localhost:5000/api/journal-entries \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-H "Content-Type: application/json" \
-d '{
  "title": "Killing a Dragon",
  "content": "Its easy to kill a dragon. just poke its eye with a sword",
  "isPublic": true
}'
```

Response:
```json
{"title":"Killing a Dragon","content":"Its easy to kill a dragon. just poke its eye with a sword","author_id":"66cdb573a4f329c5533e2c02","author_name":"jhonney","createdAt":"2024-08-27T11:42:28.185Z","isPublic":true,"_id":"66cdbba4a58183d1271a46df"}
```

#### Get User's Journal Entries

```bash
curl -X GET http://localhost:5000/api/journal-entries/user/ \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
[{"_id":"66cdbba4a58183d1271a46df","title":"Killing a Dragon","content":"Its easy to kill a dragon. just poke its eye with a sword","author_id":"66cdb573a4f329c5533e2c02","author_name":"jhonney","createdAt":"2024-08-27T11:42:28.185Z","isPublic":true},...]
```

#### Get Public Journal Entries

```bash
curl -X GET http://localhost:5000/api/public/journal-entries
```

Response:
```json
[{"_id":"66c3930a3c20cc88713e5163","title":"My First Public Journal Entry","content":"Today I learned how to use curl commands with Express.","author_id":"66c1dd4342ee9b679f58aea5","author_name":"jhonney","createdAt":"2024-08-19T18:46:34.563Z","isPublic":true},...]
```

#### Get a Specific Journal Entry

```bash
curl -X GET http://localhost:5000/api/journal-entries/66cdbc50a58183d1271a46e1 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{"_id":"66cdbc50a58183d1271a46e1","title":"Discovering a Hidden World","content":"To find a hidden world, just follow the map","

author_id":"66cdb573a4f329c5533e2c02","author_name":"jhonney","createdAt":"2024-08-27T11:47:30.000Z","isPublic":true}
```

#### Update a Journal Entry

```bash
curl -X PUT http://localhost:5000/api/journal-entries/66cdbc50a58183d1271a46e1 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-H "Content-Type: application/json" \
-d '{
  "content": "To find a hidden world, First find map. Then, just follow the map",
  "isPublic": false
}'
```

Response:
```json
{"_id":"66cdbc50a58183d1271a46e1","title":"Discovering a Hidden World","content":"To find a hidden world, First find map. Then, just follow the map","author_id":"66cdb573a4f329c5533e2c02","author_name":"jhonney","createdAt":"2024-08-27T11:47:30.000Z","isPublic":false}
```

#### Delete a Journal Entry

```bash
curl -X DELETE http://localhost:5000/api/journal-entries/66c3930a3c20cc88713e5163 \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```
Journal Entry deleted successfully
```

#### Search Journal Entries

```bash
curl -X GET "http://localhost:5000/api/search/journal-entries?q=map" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
[{"_id":"66cdbc50a58183d1271a46e1","title":"Discovering a Hidden World","content":"To find a hidden world, First find map. Then, just follow the map","author_id":"66cdb573a4f329c5533e2c02","author_name":"jhonney","createdAt":"2024-08-27T11:47:30.000Z","isPublic":false}]
```

### Password Reset

#### Request Password Reset

```bash
curl -X POST http://localhost:5000/api/auth/request-password-reset \
-H "Content-Type: application/json" \
-d '{
  "email": "Johnney_Q48@gmail.com"
}'
```

Response:
```json
{"message":"Password reset email sent"}
```

#### Reset Password

```bash
curl -X POST "http://localhost:5000/api/auth/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
-H "Content-Type: application/json" \
-d '{
  "password": "newPassword"
}'
```

Response:
```json
{"message":"Password reset successful"}
```

### User Logout and Account Deletion

#### User Logout

```bash
curl -X POST http://localhost:5000/api/user/logout \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{"message":"Logout successful"}
```

#### Delete User Account

```bash
curl -X DELETE http://localhost:5000/api/user/profile/ \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{"message":"User account deleted successfully"}
```

---

## Code Samples

This section provides code samples for common operations using the JournalHub API. These samples are written in JavaScript using the `fetch` API, which is widely supported in modern browsers and Node.js environments.

### User Authentication

#### Register a New User

```javascript
async function registerUser(userData) {
  const response = await fetch('http://localhost:5000/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Usage
const userData = {
  fullName: 'John Doe',
  nickname: 'johnd',
  email: 'john@example.com',
  password: 'securePassword123'
};

try {
  const result = await registerUser(userData);
  console.log('User registered:', result);
} catch (error) {
  console.error('Registration failed:', error);
}
```

#### User Login

```javascript
async function loginUser(credentials) {
  const response = await fetch('http://localhost:5000/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Usage
const credentials = {
  email: 'john@example.com',
  password: 'securePassword123'
};

try {
  const { token } = await loginUser(credentials);
  console.log('Login successful. Token:', token);
  // Store the token securely for future API calls
} catch (error) {
  console.error('Login failed:', error);
}
```

### Journal Entries

#### Create a New Journal Entry

```javascript
async function createJournalEntry(entryData, token) {
  const response = await fetch('http://localhost:5000/api/journal-entries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(entryData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Usage
const entryData = {
  title: 'My First Journal Entry',
  content: 'Today was an amazing day!',
  isPublic: false
};

const token = 'your_jwt_token_here';

try {
  const newEntry = await createJournalEntry(entryData, token);
  console.log('New entry created:', newEntry);
} catch (error) {
  console.error('Failed to create entry:', error);
}
```

#### Get User's Journal Entries

```javascript
async function getUserJournalEntries(token, page = 1, limit = 10) {
  const response = await fetch(`http://localhost:5000/api/journal-entries/user?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Usage
const token = 'your_jwt_token_here';

try {
  const entries = await getUserJournalEntries(token);
  console.log('User journal entries:', entries);
} catch (error) {
  console.error('Failed to fetch entries:', error);
}
```

#### Update a Journal Entry

```javascript
async function updateJournalEntry(entryId, updateData, token) {
  const response = await fetch(`http://localhost:5000/api/journal-entries/${entryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Usage
const entryId = 'entry_id_here';
const updateData = {
  title: 'Updated Title',
  content: 'This entry has been updated!',
  isPublic: true
};
const token = 'your_jwt_token_here';

try {
  const updatedEntry = await updateJournalEntry(entryId, updateData, token);
  console.log('Entry updated:', updatedEntry);
} catch (error) {
  console.error('Failed to update entry:', error);
}
```

#### Search Journal Entries

```javascript
async function searchJournalEntries(query, token) {
  const response = await fetch(`http://localhost:5000/api/search/journal-entries?q=${encodeURIComponent(query)}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}

// Usage
const searchQuery = 'important';
const token = 'your_jwt_token_here';

try {
  const searchResults = await searchJournalEntries(searchQuery, token);
  console.log('Search results:', searchResults);
} catch (error) {
  console.error('Search failed:', error);
}
```

---

## Changelog

### Version History

#### Initial Submission:
The original JournalHub project, submitted as a final boot camp project, was basic, with several logic flaws and security vulnerabilities.

### Improvements and New Features:

#### JWT Enhancement
- JWT now serves as a user data delivery system, extracting user data directly from the token.

<details>
<summary>More details</summary>

Initially, JWT was only used for generating and verifying tokens. Now, it also serves as a user data delivery system. Consequently, routes that previously required user ID and other info as parameters now extract these directly from the token. The token now includes the user's full name, nickname, and email.
</details>

#### Token Blacklisting
- Replaced Redis with MongoDB's TTL index for token blacklisting, simplifying the system.

<details>
<summary>More details</summary>

Previously, Redis was used solely for managing token blacklisting. Now, MongoDB's TTL index handles this, simplifying the system by eliminating the need for Redis. Blacklisted tokens are automatically removed upon expiration.
</details>

#### Account Deletion
- Now deletes all associated journal entries and blacklists the access token.

<details>
<summary>More details</summary>

The account deletion process has been enhanced. It now deletes all associated journal entries and blacklists the access token used for the operation.
</details>

#### User Profile
- Added nickname and profile picture support, with the picture stored as a base64-encoded string.

<details>
<summary>More details</summary>

The registration process has been expanded to include a nickname, and the name field has been updated to "fullName." Additionally, user profiles now include a base64-encoded profile picture stored as a string, with a default image provided.
</details>

#### Password Update
- New route for updating passwords.

<details>
<summary>More details</summary>

A new route has been added to allow users to update their passwords, addressing a previous oversight in the user profile update process.
</details>

#### Logging Enhancement
- Implemented Winston and Morgan for logging.

<details>
<summary>More details</summary>

- Implemented Winston for logging crucial information and errors to files, improving debugging and monitoring capabilities.
- Added Morgan logger to track and log API access, providing insights into API usage patterns.
</details>

#### Rate Limiting
- Global rate limit of 50 requests per 15-minute window.

<details>
<summary>More details</summary>

Implemented a global rate limit of 50 requests per 15-minute window for each IP address, enhancing API security and ensuring fair usage.
</details>

#### Request Validation
- Added Joi-based request validation middleware.

<details>
<summary>More details</summary>

Added middleware for request validation using Joi schemas, improving data integrity and reducing invalid requests.
</details>

#### Pagination
- Implemented pagination for journal entry retrieval.

<details>
<summary>More details</summary>

Implemented pagination for journal entry retrieval operations, including both user-specific and public entries. This improves performance and user experience when dealing with large datasets.
</details>

#### Journal Entry Search
- Users can search their entries by title and content.

<details>
<summary>More details</summary>

Users can now search through their entries by title and content using indexed text fields in MongoDB.
</details>

#### Public Entries
- Users can mark entries as public or private.

<details>
<summary>More details</summary>

Users can mark journal entries as public, making them viewable by anyone. Users can also revert public entries to private at any time.
</details>

#### Mailer Integration
- Added automatic email notifications.

<details>
<summary>More details</summary>

A mailer system has been added to automatically send emails for registration, profile updates, and password resets. This was implemented using NodeMailer.
</details>

#### Password Reset Feature
- Enhanced password reset functionality with token-based authentication.

<details>
<summary>More details</summary>

A new password reset functionality has been implemented, enhancing account security and user experience. This feature includes two new routes:
1. Request Password Reset: Allows users to initiate a password reset by providing their email. The system generates a reset token and sends an email containing a link with this token.
2. Reset Password: Enables users to set a new password using the token received via email. This route verifies the token and updates the user's password securely.

These routes integrate with the new Mailer system, ensuring secure and user-friendly password recovery.
</details>

---

## Glossary

- **CRUD**: Create, Read, Update, Delete – basic operations for managing resources.
- **JWT (JSON Web Token)**: A compact, URL-safe means of representing claims to be transferred between two parties.
- **TTL (Time to Live)**: A mechanism that automatically removes expired data from the database.
- **MongoDB**: A NoSQL document-oriented database used to store user and journal data.
- **Winston**: A versatile logging library for Node.js.
- **Morgan**: An HTTP request logger middleware for Node.js.

---

## Contact Information

For support or inquiries, please contact:

- **Email**: journalhub2@gmail.com
- **Phone**: +234 8132619146 (WAT - West Africa Time)

---
