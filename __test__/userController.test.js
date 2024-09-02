import bcrypt from 'bcrypt';
import User from '../src/models/User';
import {
  registerUser, 
  getUserProfile,
  updateUserProfile,
  deleteUserAccount } from '../src/controllers/userController';

  describe('User Controller', () => {
    let req, res;
  
    beforeEach(() => {
      req = { body: {}, params: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks(); // important, i forgot this before
    });
  
    describe('registerUser', () => {
      it('should return error if user already exists', async () => {
        jest.spyOn(User, 'findByEmail').mockResolvedValue(true);
  
        req.body = { name: 'John Doe', email: 'john@example.com', password: 'securepassword' };
  
        await registerUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
      });
  
      it('should create a new user', async () => {
        jest.spyOn(User, 'findByEmail').mockResolvedValue(false);
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');
        jest.spyOn(User.prototype, 'save').mockResolvedValue('newUserId');
  
        req.body = { name: 'John Doe', email: 'john@example.com', password: 'securepassword' };
  
        await registerUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ userId: 'newUserId' });
      });
  
      it('should handle errors', async () => {
        jest.spyOn(User, 'findByEmail').mockImplementation(() => {
          throw new Error('Error');
        });
  
        req.body = { name: 'John Doe', email: 'john@example.com', password: 'securepassword' };
  
        await registerUser(req, res);
  
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server error' });
      });
    });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      sandbox.stub(User, 'findById').resolves({ name: 'John Doe' });

      req.params = { userId: 'userId' };

      await getUserProfile(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ user: { name: 'John Doe' } })).to.be.true;
    });

    it('should return error if user not found', async () => {
      sandbox.stub(User, 'findById').resolves(null);

      req.params = { userId: 'userId' };

      await getUserProfile(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
    });

    it('should handle errors', async () => {
      sandbox.stub(User, 'findById').throws(new Error('Error'));

      req.params = { userId: 'userId' };

      await getUserProfile(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Server error' })).to.be.true;
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile', async () => {
      sandbox.stub(User, 'update').resolves(true);

      req.params = { userId: 'userId' };
      req.body = { name: 'John Smith' };

      await updateUserProfile(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'User profile updated successfully' })).to.be.true;
    });

    it('should return error if user not found or no changes applied', async () => {
      sandbox.stub(User, 'update').resolves(false);

      req.params = { userId: 'userId' };
      req.body = { name: 'John Smith' };

      await updateUserProfile(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'User not found or no changes applied' })).to.be.true;
    });

    it('should handle errors', async () => {
      sandbox.stub(User, 'update').throws(new Error('Error'));

      req.params = { userId: 'userId' };
      req.body = { name: 'John Smith' };

      await updateUserProfile(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Server error' })).to.be.true;
    });
  });

  describe('deleteUserAccount', () => {
    it('should delete user account', async () => {
      sandbox.stub(User, 'delete').resolves(true);

      req.params = { userId: 'userId' };

      await deleteUserAccount(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ message: 'User account deleted successfully' })).to.be.true;
    });

    it('should return error if user not found', async () => {
      sandbox.stub(User, 'delete').resolves(false);

      req.params = { userId: 'userId' };

      await deleteUserAccount(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ error: 'User not found' })).to.be.true;
    });

    it('should handle errors', async () => {
      sandbox.stub(User, 'delete').throws(new Error('Error'));

      req.params = { userId: 'userId' };

      await deleteUserAccount(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Server error' })).to.be.true;
    });
  });
});
