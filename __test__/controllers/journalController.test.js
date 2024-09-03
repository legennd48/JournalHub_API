import request from 'supertest';
import express from 'express';
import router from '../../src/routes/index';

const app = express();
app.use(express.json());
app.use(router);

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
