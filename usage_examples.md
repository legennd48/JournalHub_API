

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
