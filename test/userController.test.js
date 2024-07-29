import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcrypt';
import User from '../models/User';
import {
  registerUser, 
  getUserProfile,
  updateUserProfile,
  deleteUserAccount } from '../controllers/userController';

describe('User Controller', () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = { body: {}, params: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub()
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('registerUser', () => {
    it('should return error if user already exists', async () => {
      sandbox.stub(User, 'findByEmail').resolves(true);

      req.body = { name: 'John Doe', email: 'john@example.com', password: 'securepassword' };

      await registerUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ error: 'User already exists' })).to.be.true;
    });

    it('should create a new user', async () => {
      sandbox.stub(User, 'findByEmail').resolves(false);
      sandbox.stub(bcrypt, 'hash').resolves('hashedpassword');
      sandbox.stub(User.prototype, 'save').resolves('newUserId');

      req.body = { name: 'John Doe', email: 'john@example.com', password: 'securepassword' };

      await registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ userId: 'newUserId' })).to.be.true;
    });

    it('should handle errors', async () => {
      sandbox.stub(User, 'findByEmail').throws(new Error('Error'));

      req.body = { name: 'John Doe', email: 'john@example.com', password: 'securepassword' };

      await registerUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ error: 'Server error' })).to.be.true;
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
