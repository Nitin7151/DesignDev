import { Request, Response } from 'express';
import { signup, signin, getUserProfile } from '../src/controllers/authController';
import User from '../src/models/User';
import { generateToken } from '../src/config/jwt';
import { validationResult } from 'express-validator';

// Mock dependencies
jest.mock('../src/models/User');
jest.mock('../src/config/jwt');
jest.mock('express-validator');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {
      body: {},
      user: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Mock validationResult to return no errors by default
    (validationResult as jest.Mock).mockReturnValue({
      isEmpty: jest.fn().mockReturnValue(true),
      array: jest.fn().mockReturnValue([])
    });
  });
  
  describe('signup', () => {
    it('should create a new user and return 201 with user data and token', async () => {
      // Setup request body
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Mock User.findOne to return null (user doesn't exist)
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      // Mock User.create to return a new user
      const mockUser = {
        _id: 'user_id',
        name: req.body.name,
        email: req.body.email,
        password: 'hashed_password'
      };
      (User.create as jest.Mock).mockResolvedValue(mockUser);
      
      // Mock generateToken
      const mockToken = 'mock_token';
      (generateToken as jest.Mock).mockReturnValue(mockToken);
      
      // Call signup controller
      await signup(req as Request, res as Response);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(User.create).toHaveBeenCalledWith({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      expect(generateToken).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        token: mockToken
      });
    });
    
    it('should return 400 if user already exists', async () => {
      // Setup request body
      req.body = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      // Mock User.findOne to return an existing user
      (User.findOne as jest.Mock).mockResolvedValue({ 
        _id: 'existing_id',
        email: req.body.email 
      });
      
      // Call signup controller
      await signup(req as Request, res as Response);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(User.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
    });
    
    it('should return 400 if validation fails', async () => {
      // Mock validation errors
      const mockErrors = [{ msg: 'Name is required', param: 'name' }];
      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue(mockErrors)
      });
      
      // Call signup controller
      await signup(req as Request, res as Response);
      
      // Assertions
      expect(User.findOne).not.toHaveBeenCalled();
      expect(User.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: mockErrors });
    });
    
    it('should return 400 if user creation fails', async () => {
      // Setup request body
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Mock User.findOne to return null (user doesn't exist)
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      // Mock User.create to return null (creation failed)
      (User.create as jest.Mock).mockResolvedValue(null);
      
      // Call signup controller
      await signup(req as Request, res as Response);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user data' });
    });
    
    it('should return 500 if server error occurs', async () => {
      // Setup request body
      req.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Mock User.findOne to throw error
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Call signup controller
      await signup(req as Request, res as Response);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
  
  describe('signin', () => {
    it('should authenticate user and return token', async () => {
      // Setup request body
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Mock User.findOne to return user
      const mockUser = {
        _id: 'user_id',
        name: 'Test User',
        email: req.body.email,
        comparePassword: jest.fn().mockResolvedValue(true)
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      
      // Mock generateToken
      const mockToken = 'mock_token';
      (generateToken as jest.Mock).mockReturnValue(mockToken);
      
      // Call signin controller
      await signin(req as Request, res as Response);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(req.body.password);
      expect(generateToken).toHaveBeenCalledWith(mockUser);
      expect(res.json).toHaveBeenCalledWith({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        token: mockToken
      });
    });
    
    it('should return 401 if user not found', async () => {
      // Setup request body
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      // Mock User.findOne to return null (user not found)
      (User.findOne as jest.Mock).mockResolvedValue(null);
      
      // Call signin controller
      await signin(req as Request, res as Response);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });
    
    it('should return 401 if password does not match', async () => {
      // Setup request body
      req.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      
      // Mock User.findOne to return user
      const mockUser = {
        _id: 'user_id',
        name: 'Test User',
        email: req.body.email,
        comparePassword: jest.fn().mockResolvedValue(false) // Password doesn't match
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      
      // Call signin controller
      await signin(req as Request, res as Response);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(mockUser.comparePassword).toHaveBeenCalledWith(req.body.password);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
    });
    
    it('should return 400 if validation fails', async () => {
      // Mock validation errors
      const mockErrors = [{ msg: 'Email is required', param: 'email' }];
      (validationResult as jest.Mock).mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue(mockErrors)
      });
      
      // Call signin controller
      await signin(req as Request, res as Response);
      
      // Assertions
      expect(User.findOne).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: mockErrors });
    });
    
    it('should return 500 if server error occurs', async () => {
      // Setup request body
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Mock User.findOne to throw error
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));
      
      // Call signin controller
      await signin(req as Request, res as Response);
      
      // Assertions
      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
  
  describe('getUserProfile', () => {
    it('should return user profile without password', async () => {
      // Setup user in request (set by auth middleware)
      req.user = {
        _id: 'user_id'
      };
      
      // Mock User.findById to return user
      const mockUser = {
        _id: 'user_id',
        name: 'Test User',
        email: 'test@example.com'
      };
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });
      
      // Call getUserProfile controller
      await getUserProfile(req as Request, res as Response);
      
      // Assertions
      expect(User.findById).toHaveBeenCalledWith(req.user._id);
      expect(res.json).toHaveBeenCalledWith({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email
      });
    });
    
    it('should return 404 if user not found', async () => {
      // Setup user in request
      req.user = {
        _id: 'nonexistent_id'
      };
      
      // Mock User.findById to return null
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });
      
      // Call getUserProfile controller
      await getUserProfile(req as Request, res as Response);
      
      // Assertions
      expect(User.findById).toHaveBeenCalledWith(req.user._id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
    
    it('should return 500 if server error occurs', async () => {
      // Setup user in request
      req.user = {
        _id: 'user_id'
      };
      
      // Mock User.findById to throw error
      (User.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      });
      
      // Call getUserProfile controller
      await getUserProfile(req as Request, res as Response);
      
      // Assertions
      expect(User.findById).toHaveBeenCalledWith(req.user._id);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});
