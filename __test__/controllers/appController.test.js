import request from 'supertest';
import express from 'express';
import router from '../../src/routes/index';

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

  it('GET /api/user/:id/journal-entries, should return user journal entries', async () => {
    const res = await request(app).get('/api/user/66d212bb0ec12d0c27b00064/journal-entries');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('userId', '66d212bb0ec12d0c27b00064');
    expect(res.body).toHaveProperty('user_entries');
  });
});
