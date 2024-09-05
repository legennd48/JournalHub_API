import request from 'supertest';
import express from 'express';
import router from '../../src/routes/index';

const app = express();
app.use(express.json());
app.use(router);

describe('AuthController Routes', () => {
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

  it('POST /api/auth/request-password-reset should request a password reset', async () => {
    const res = await request(app)
      .post('/api/auth/request-password-reset')
      .send({ email: 'johndoe@example.com' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Password reset email sent');
  });
});
