import bcrypt from 'bcrypt';
import User from '../../src/models/User';
import {
  registerUser, 
  getUserProfile,
  updateUserProfile,
  deleteUserAccount 
} from '../../src/controllers/userController';

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  describe('registerUser', () => {
    it('should return error if user already exists', async () => {
      jest.spyOn(User, 'findByEmail').mockResolvedValue(true);

      req.body = { name: 'John Doe', email: 'johndoe@example.com', password: 'password123' };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });

    it('should create a new user', async () => {
      jest.spyOn(User, 'findByEmail').mockResolvedValue(false);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');
      jest.spyOn(User.prototype, 'save').mockResolvedValue('newUserId');

      req.body = { fullName: 'John Doe', nickname: 'J_DOW', email: 'john@example.com', password: 'securepassword' };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ userId: 'newUserId' });
    });

    it('should handle errors', async () => {
      jest.spyOn(User, 'findByEmail').mockImplementation(() => {
        throw new Error('Error');
      });

      req.body = { name: 'John Doe',  email: 'john@example.com', password: 'securepassword' };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error Registering new user' });
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue({ name: 'John Doe' });

      req.params = { userId: 'userId' };

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user: { name: 'John Doe' } });
    });

    it('should return error if user not found', async () => {
      jest.spyOn(User, 'findById').mockResolvedValue(null);

      req.params = { userId: 'userId' };

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle errors', async () => {
      jest.spyOn(User, 'findById').mockImplementation(() => {
        throw new Error('Error');
      });

      req.params = { userId: 'userId' };

      await getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile', async () => {
      jest.spyOn(User, 'update').mockResolvedValue(true);

      req.params = { userId: 'userId' };
      req.body = { name: 'John Smith' };

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User profile updated successfully' });
    });

    it('should return error if user not found or no changes applied', async () => {
      jest.spyOn(User, 'update').mockResolvedValue(false);

      req.params = { userId: 'userId' };
      req.body = { name: 'John Smith' };

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found or no changes applied' });
    });

    it('should handle errors', async () => {
      jest.spyOn(User, 'update').mockImplementation(() => {
        throw new Error('Error');
      });

      req.params = { userId: 'userId' };
      req.body = { name: 'John Smith' };

      await updateUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });

  describe('deleteUserAccount', () => {
    it('should delete user account', async () => {
      jest.spyOn(User, 'delete').mockResolvedValue(true);

      req.params = { userId: 'userId' };

      await deleteUserAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User account deleted successfully' });
    });

    it('should return error if user not found', async () => {
      jest.spyOn(User, 'delete').mockResolvedValue(false);

      req.params = { userId: 'userId' };

      await deleteUserAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle errors', async () => {
      jest.spyOn(User, 'delete').mockImplementation(() => {
        throw new Error('Error');
      });

      req.params = { userId: 'userId' };

      await deleteUserAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
    });
  });
});
