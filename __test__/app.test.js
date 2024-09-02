import request from 'supertest';
import express from 'express';
import router from '../src/routes/index';

const app = express();
app.use(express.json());
app.use(router);

describe('AppController Routes', () => {
  it('GET /api/status should return status of the application', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('MongoDB');
    expect(res.body).toHaveProperty('JourlaHub');
  });

  it('GET /api/stats should return statistics', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
    expect(res.body).toHaveProperty('entries');
  });
});

describe('UserController Routes', () => {
  it('POST /api/user/register should register a new user', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({
        fullName: 'John Doe',
        nickname: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('POST /api/user/login should log in the user', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('JournalEntryController Routes', () => {
  it('POST /api/journal-entries should create a new journal entry', async () => {
    const loginRes = await request(app)
      .post('/api/user/login')
      .send({
        email: 'johndoe@example.com',
        password: 'password123',
      });

    const token = loginRes.body.token;

    const res = await request(app)
      .post('/api/journal-entries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'My First Journal Entry',
        content: 'This is the content of my first journal entry.',
        isPublic: true,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'My First Journal Entry');
  });
});
