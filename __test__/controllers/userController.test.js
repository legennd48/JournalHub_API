import bcrypt from 'bcrypt';
import request from 'supertest';
import express from 'express';
import { registerUser, getUserProfile, updateUserProfile, deleteUserAccount, updateUserPassword } from '../../src/controllers/userController';
import User from '../../src/models/User';
import JournalEntry from '../../src/models/JournalEntry';
import { extractToken, blacklistToken, extractTokenExpiration } from '../../src/utils/jwt';
import { sendWelcomeMail, sendProfileUpdatedMail, sendPasswordChangedMail, sendAccountDeletedMail } from '../../src/utils/mailer';
import { logger } from '../../src/middleware/logger';
import router from '../../src/routes/index';

const app = express();
app.use(express.json());
app.use(router);

jest.mock('../../src/models/User');
jest.mock('../../src/models/JournalEntry');
jest.mock('bcrypt');
jest.mock('../../src/utils/jwt');
jest.mock('../../src/utils/mailer');
jest.mock('../../src/middleware/logger');

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clears all mocks after each test
  });

  describe('registerUser', () => {
    it('should return an error if the user already exists', async () => {
      User.findByEmail.mockResolvedValue(true);

      req.body = { fullName: 'John Doe', nickname: 'johndoe', email: 'john@example.com', password: 'password123' };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('User already exists'), expect.any(Object));
    });

    it('should create a new user and return the userId', async () => {
      User.findByEmail.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      User.prototype.save.mockResolvedValue('newUserId');
      sendWelcomeMail.mockResolvedValue();

      req.body = { fullName: 'John Doe', nickname: 'johndoe', email: 'john@example.com', password: 'password123' };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ userId: 'newUserId' });
      expect(sendWelcomeMail).toHaveBeenCalledWith('john@example.com');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('New user registered successfully'), expect.any(Object));
    });

    it('should handle errors during registration', async () => {
      User.findByEmail.mockRejectedValue(new Error('Registration error'));

      req.body = { fullName: 'John Doe', nickname: 'johndoe', email: 'john@example.com', password: 'password123' };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error Registering new user' });
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Registration error'), expect.any(Object));
    });
  });

  describe('getUserProfile', () => {
    it('should return the user profile if the user exists', async () => {
      req.user = { userId: 'userId' };
      User.findById.mockResolvedValue({ fullName: 'John Doe', email: 'john@example.com' });

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { fullName: 'John Doe', email: 'john@example.com' } });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('User profile fetched successfully'), expect.any(Object));
    });

    it('should return an error if the user is not found', async () => {
      req.user = { userId: 'userId' };
      User.findById.mockResolvedValue(null);

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('User profile fetch failed'), expect.any(Object));
    });

    it('should handle errors during fetching user profile', async () => {
      req.user = { userId: 'userId' };
      User.findById.mockRejectedValue(new Error('Fetch error'));

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Error fetching user profile'), expect.any(Object));
    });
  });

  describe('updateUserProfile', () => {
    it('should update the user profile successfully', async () => {
      req.user = { userId: 'userId', email: 'old@example.com' };
      req.body = { fullName: 'John Smith', email: 'new@example.com' };
      User.update.mockResolvedValue(true);
      sendProfileUpdatedMail.mockResolvedValue();

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User profile updated successfully' });
      expect(sendProfileUpdatedMail).toHaveBeenCalledWith('new@example.com');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('User profile updated successfully'), expect.any(Object));
    });

    it('should return an error if no changes were applied', async () => {
      req.user = { userId: 'userId' };
      req.body = { fullName: 'John Smith' };
      User.update.mockResolvedValue(false);

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found or no changes applied' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('User profile update failed'), expect.any(Object));
    });

    it('should handle errors during updating the user profile', async () => {
      req.user = { userId: 'userId' };
      req.body = { fullName: 'John Smith' };
      User.update.mockRejectedValue(new Error('Update error'));

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('User profile update error'), expect.any(Object));
    });
  });

  describe('deleteUserAccount', () => {
    it('should delete the user account successfully', async () => {
      req.user = { userId: 'userId', email: 'john@example.com' };
      req.headers.authorization = 'Bearer validToken';
      JournalEntry.deleteJournalEntriesByUser.mockResolvedValue(true);
      User.delete.mockResolvedValue(true);
      extractToken.mockReturnValue('validToken');
      extractTokenExpiration.mockResolvedValue(new Date());
      blacklistToken.mockResolvedValue();

      await deleteUserAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User account deleted successfully' });
      expect(sendAccountDeletedMail).toHaveBeenCalledWith('john@example.com');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('User account deleted successfully'), expect.any(Object));
    });

    it('should return an error if no journal entries to delete', async () => {
      req.user = { userId: 'userId' };
      JournalEntry.deleteJournalEntriesByUser.mockResolvedValue(false);

      await deleteUserAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found or no journal entries to delete' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Delete user account failed'), expect.any(Object));
    });

    it('should handle errors during deleting the user account', async () => {
      req.user = { userId: 'userId' };
      JournalEntry.deleteJournalEntriesByUser.mockRejectedValue(new Error('Delete error'));

      await deleteUserAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Delete user account error'), expect.any(Object));
    });

    it('should return an error if the token is invalid', async () => {
      req.user = { userId: 'userId' };
      req.headers.authorization = 'Bearer invalidToken';
      JournalEntry.deleteJournalEntriesByUser.mockResolvedValue(true);
      User.delete.mockResolvedValue(true);
      extractToken.mockReturnValue('invalidToken');
      extractTokenExpiration.mockResolvedValue(null); // Simulate invalid token

      await deleteUserAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid Token' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Delete user account failed: Invalid token'), expect.any(Object));
    });
  });

  describe('updateUserPassword', () => {
    it('should update the user password successfully', async () => {
      req.user = { userId: 'userId' };
      req.body = { password: 'oldPassword', newPassword: 'newPassword123' };
      User.findById.mockResolvedValue({ password: 'hashedOldPassword', email: 'john@example.com' });
      bcrypt.compare.mockResolvedValue(true); // Old password matches
      bcrypt.hash.mockResolvedValue('hashedNewPassword');
      User.update.mockResolvedValue(true);
      sendPasswordChangedMail.mockResolvedValue();

      await updateUserPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password updated successfully' });
      expect(sendPasswordChangedMail).toHaveBeenCalledWith('john@example.com');
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('User password updated successfully'), expect.any(Object));
    });

    it('should return an error if the old password is incorrect', async () => {
      req.user = { userId: 'userId' };
      req.body = { password: 'wrongOldPassword', newPassword: 'newPassword123' };
      User.findById.mockResolvedValue({ password: 'hashedOldPassword', email: 'john@example.com' });
      bcrypt.compare.mockResolvedValue(false); // Old password does not match

      await updateUserPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Update password failed: Invalid password'), expect.any(Object));
    });

    it('should return an error if the user is not found', async () => {
      req.user = { userId: 'userId' };
      req.body = { password: 'oldPassword', newPassword: 'newPassword123' };
      User.findById.mockResolvedValue(null); // User not found

      await updateUserPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Update password failed: User not found'), expect.any(Object));
    });

    it('should handle errors during password update', async () => {
      req.user = { userId: 'userId' };
      req.body = { password: 'oldPassword', newPassword: 'newPassword123' };
      User.findById.mockRejectedValue(new Error('Update password error'));

      await updateUserPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('Update password error'), expect.any(Object));
    });
  });
});
