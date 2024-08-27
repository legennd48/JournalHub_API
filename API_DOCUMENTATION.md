Introduction

# JournalHub API Documentation

The JournalHub API is an online journal platform designed to enable users to perform basic journaling functions, such as creating, reading, updating, and deleting (CRUD) their journal entries. It ensures that all journal entries are securely stored in the cloud, providing users with a safe and accessible way to manage their personal or professional journals. The API is intended for use by anyone who wants a simple and reliable journaling tool.

## Architecture

The JournalHub API is structured around a modular architecture that promotes separation of concerns and scalability. The architecture is organized into several key components:

### Controllers:

- App Controller: Manages the initialization of the application and handles generic routes.
    - *Example*: Handles the root route (`/`) to check if the API is running.
- JournalEntries Controller: Handles all operations related to journal entries, including creating, reading, updating, and deleting entries. It ensures that entries are correctly associated with users and that access controls are enforced.
    - *Example*: Manages the route (`/api/journal-entries`) for CRUD operations on journal entries.
- User Controller: Manages user-related operations, such as registration, profile management, and account deletion.
    - *Example*: Manages the route (`/api/user/register`) for user registration.
- Auth Controller: Handles authentication and authorization processes, including user login, token generation, password resets, and token validation.
    - *Example*: Manages the route (`/api/user/login`) for user login and JWT generation.

### Models:
- JournalEntry Model: Represents the structure of a journal entry within the database, including fields such as title, content, and visibility (public/private). It defines the relationships between entries and users.
    - *Example*: A journal entry document might include `{ title: "My Day", content: "Today was great!", isPublic: true }`.
- User Model: Represents user information within the database, including fields such as full name, nickname, email, and password. It defines relationships with journal entries and manages user authentication data.
    - *Example*: A user document might include `{ fullName: "John Doe", nickname: "johnny", email: "john@example.com", password: "hashedPassword" }`.

### Utilities:
- db.js: Manages the connection to the MongoDB database, ensuring that the API can efficiently read from and write to the database.
- jwt.js: Provides functions for generating and verifying JSON Web Tokens (JWT), which are used for securing API routes and managing user sessions.
- mailer.js: Handles the sending of emails, such as welcome emails, password reset instructions, and notifications for changes to user accounts.

### Middleware:
Middleware functions are used throughout the application to handle tasks such as validating incoming requests, checking user authentication status, and logging application activity.

## Database:
The application uses MongoDB as its primary data store, leveraging its document-based structure to manage user information and journal entries. MongoDB’s flexible schema allows the API to efficiently handle various types of journal content and user data.

## Security:
Security is a core focus of the JournalHub API. User passwords are hashed using bcrypt before being stored in the database. JWT tokens are used to manage user sessions, ensuring that only authenticated users can access or modify their data. Additionally, sensitive operations like password resets are secured through token-based authentication and validation.

## Base URL: 
http://localhost:5000/

## Authentication

### Overview: 
JournalHub uses JWT (JSON Web Token) for authentication. JWT is a secure and stateless authentication mechanism, allowing users to authenticate themselves once and then use the token for subsequent requests without having to re-authenticate.

### Obtaining a Token
To authenticate a user and obtain a JWT, you need to send a POST request to the `/api/user/login` endpoint with the user's credentials (email and password). Upon successful authentication, the server will return a JWT, which must be included in the Authorization header of subsequent requests.

### Registration
- Endpoint: `/api/user/register`
- Method: POST
- Request Body: JSON object containing `fullName`, `nickname`, `email`, and `password`.
- Response: Success message or error details.

### Login
- Endpoint: `/api/user/login`
- Method: POST
- Request Body: JSON object containing `email` and `password`.
- Response: JWT token or error message.

### Logout
- Endpoint: `/api/user/logout`
- Method: POST
- Headers: `Authorization: Bearer <token>`
- Response: Success message or error details.

## User Management

### Get User Profile
- Endpoint: `/api/user/profile`
- Method: GET
- Headers: `Authorization: Bearer <token>`
- Response: User details or error message.

### Update User Profile
- Endpoint: `/api/user/profile`
- Method: PUT
- Headers: `Authorization: Bearer <token>`
- Request Body: JSON object containing fields to update (`fullName`, `nickname`).
- Response: Updated user details or error message.

### Delete User Account (Deletes all user entries too)
- Endpoint: `/api/user/profile`
- Method: DELETE
- Headers: `Authorization: Bearer <token>`
- Response: Success message or error details.

### Update Password
- Endpoint: `/api/user/profile/password`
- Method: PUT
- Headers: `Authorization: Bearer <token>`
- Request Body: JSON object containing `password` and `newPassword`.
- Response: Success message or error details.

## Journal Entries

### Create Journal Entry
- Endpoint: `/api/journal-entries`
- Method: POST
- Headers: `Authorization: Bearer <token>`
- Request Body: JSON object containing `title`, `content`, and `isPublic`.
- Response: Created journal entry details or error message.

### Get Journal Entries by User ID
- Endpoint: `/api/journal-entries/user/`
- Method: GET
- Headers: `Authorization: Bearer <token>`
- Response: Array of journal entries or error message.

### Update Journal Entry
- Endpoint: `/api/journal-entries/:entryId`
- Method: PUT
- Headers: `Authorization: Bearer <token>`
- Request Body: JSON object containing fields to update (`title`, `content`, `isPublic`).
- Response: Updated journal entry or error message.

### Delete Journal Entry
- Endpoint: `/api/journal-entries/:entryId`
- Method: DELETE
- Headers: `Authorization: Bearer <token>`
- Response: Success message or error details.

### Get Public Journal Entries
- Endpoint: `/api/public/journal-entries`
- Method: GET
- Response: Array of public journal entries or error message.

### Search Journal Entries
- Endpoint: `/api/search/journal-entries`
- Method: GET
- Headers: `Authorization: Bearer <token>`
- Query Params: `q` (search term).
- Response: Array of matching journal entries or error message.

## Error Handling

### Standard Error Responses
Describe the format of error messages, including `statusCode`, `message`, and possible causes.

### Common Error Codes
List common HTTP status codes returned by the API (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error).

## Rate Limiting

### Overview
JournalHub currently applies rate limiting only to password reset requests. This rate limit is implemented to prevent abuse and to enhance the security of user accounts.

### Password Reset Request Limits
Users are limited to a certain number of password reset requests within a given time frame. This is designed to prevent automated attacks and reduce the risk of account compromise.

### Rate Limit: [Specify the exact number if known, e.g., "5 requests per hour"].

No other rate limiting is applied across the API at this time. This may change in future updates to ensure the continued stability and security of the application.

## Versioning

### API Versioning
JournalHub does not currently implement versioning for its API. All requests are handled through the base URL without a version identifier.

### Current State
The API is in its initial version, and all endpoints are accessible through the base URL.

### Future Considerations
In the future, API versioning might be introduced to allow for backward compatibility and smoother transitions when updating or deprecating features. This would likely involve including a version number in the URL path (e.g., `/v1/api/journal-entries`).

## Security Considerations

### Data Protection
JournalHub prioritizes the security of user data, especially sensitive information like passwords.

### Password Storage
All passwords are securely hashed using a strong hashing algorithm before being stored in the database. This ensures that even if the database is compromised, the actual passwords are not exposed. At no point is the unhashed password stored.

### Token Usage
- Access Tokens: These are generated using JWT and are valid for 8 hours. They must be included in the Authorization header of requests to protected endpoints. Access tokens are blacklisted upon user logout or account deletion to prevent unauthorized access.
- Password Reset Tokens: Also generated using JWT, these tokens are valid for 1 hour and are used exclusively for password reset processes. They are blacklisted immediately after use to ensure they cannot be reused.
- Blacklisting: Both access tokens and reset tokens are blacklisted when they are no longer valid or have been used. This blacklisting prevents the use of 'logged out' and invalidated tokens. Blacklisted tokens are automatically removed from the blacklist once they expire.

### JWT Security
To maintain the security of JWTs:
- Token Expiration: Access tokens expire after 8 hours, and reset tokens expire after 1 hour. This limits the window of opportunity for attackers if a token is compromised.

### Best Practices for Storing JWTs:
- Store tokens securely: Access tokens should be stored in secure storage mechanisms, such as HTTP-only cookies or secure local storage.
- Avoid exposing tokens: Ensure that tokens are not exposed in URLs or other insecure locations that could be intercepted by attackers.
- Implement token revocation: Utilize the blacklisting mechanism to revoke tokens upon logout or after they have been used for password resets.

These security measures ensure that user data and authentication mechanisms are well-protected against potential threats.

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
{"_id":"66cdbc50a58183d1271a46e1","title":"Discovering a Hidden World","content":"To find a hidden world, just follow the map","author_id":"66cdb573a4f329c5533e2c02","author_name":"jhonney","createdAt":"2024-08-27T11:47:30.000Z","isPublic":true}
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
  "email": "legennd48@gmail.com"
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

This example section provides a comprehensive overview of how to interact with the JournalHub API using curl commands. It covers user registration, authentication, profile management, journal entry operations, password reset, and account management. Users can refer to these examples to understand how to structure their API requests and what responses to expect.


### Code Samples
Include sample code snippets for integrating the API with different programming languages or tools.

## Changelog

### Version History

#### Initial Submission:
The original JournalHub project, submitted as a final boot camp project, was basic, with several logic flaws and security vulnerabilities.

#### Improvements Made:

##### JWT Enhancement:
Initially, JWT was only used for generating and verifying tokens. Now, it also serves as a user data delivery system. Consequently, routes that previously required user ID and other info as parameters now extract these directly from the token. The token now includes the user's full name, nickname, and email.

##### Token Blacklisting:
Previously, Redis was used solely for managing token blacklisting. Now, MongoDB's TTL index handles this, simplifying the system by eliminating the need for Redis. Blacklisted tokens are automatically removed upon expiration.

##### Account Deletion:
The account deletion process has been enhanced. It now deletes all associated journal entries and blacklists the access token used for the operation.

##### User Profile:
The registration process has been expanded to include a nickname, and the name field has been updated to "fullName." Additionally, user profiles now include a base64-encoded profile picture stored as a string, with a default image provided.

##### Password Update:
A new route has been added to allow users to update their passwords, addressing a previous oversight in the user profile update process.

#### New Features:

##### Journal Entry Search:
Users can now search through their entries by title and content using indexed text fields in MongoDB.

##### Public Entries:
Users can mark journal entries as public, making them viewable by anyone. Users can also revert public entries to private at any time.

##### Mailer Integration:
A mailer system has been added to automatically send emails for registration, profile updates, and password resets. This was implemented using NodeMailer.

##### Password Reset Feature:
A new password reset functionality has been implemented, enhancing account security and user experience. This feature includes two new routes:
1. Request Password Reset: Allows users to initiate a password reset by providing their email. The system generates a reset token and sends an email containing a link with this token.
2. Reset Password: Enables users to set a new password using the token received via email. This route verifies the token and updates the user's password securely.

These routes integrate with the new Mailer system, ensuring secure and user-friendly password recovery.

## Contact Information

For support or inquiries, please contact:

- Email: journalhub2@gmail.com
- Phone: +234 8162619146 (WAT - West Africa Time)
