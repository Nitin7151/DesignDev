import { Request, Response, NextFunction } from 'express';
import { protect } from '../src/middleware/auth';
import jwt from 'jsonwebtoken';
import User from '../src/models/User';
import mongoose from 'mongoose';

// Mock the User model
jest.mock('../src/models/User', () => ({
  findById: jest.fn().mockReturnValue({
    select: jest.fn(),
  }),
}));

// Mock the jwt module
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('Auth Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request, response, and next function
    req = {
      headers: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    next = jest.fn();
  });

  it('should call next() when token is valid', async () => {
    // Setup valid token
    const userId = new mongoose.Types.ObjectId();
    const mockUser = { _id: userId, name: 'Test User', email: 'test@example.com' };
    
    // Mock jwt.verify to return decoded token
    (jwt.verify as jest.Mock).mockReturnValue({ id: userId });
    
    // Mock User.findById.select to return user
    const selectMock = jest.fn().mockResolvedValue(mockUser);
    (User.findById as jest.Mock).mockReturnValue({
      select: selectMock
    });
    
    // Set request headers with token
    req.headers = {
      authorization: 'Bearer valid-token',
    };
    
    // Call middleware
    await protect(req as Request, res as Response, next);
    
    // Assertions
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return 401 when no token is provided', async () => {
    // Call middleware with no token
    await protect(req as Request, res as Response, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token verification fails', async () => {
    // Mock jwt.verify to throw error
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    // Set request headers with invalid token
    req.headers = {
      authorization: 'Bearer invalid-token',
    };
    
    // Call middleware
    await protect(req as Request, res as Response, next);
    
    // Assertions
    expect(jwt.verify).toHaveBeenCalledWith('invalid-token', expect.any(String));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is valid but user not found', async () => {
    // Setup valid token but no user
    const userId = new mongoose.Types.ObjectId();
    
    // Mock jwt.verify to return decoded token
    (jwt.verify as jest.Mock).mockReturnValue({ id: userId });
    
    // Mock User.findById.select to return null (user not found)
    const selectMock = jest.fn().mockResolvedValue(null);
    (User.findById as jest.Mock).mockReturnValue({
      select: selectMock
    });
    
    // Set request headers with token
    req.headers = {
      authorization: 'Bearer valid-token',
    };
    
    // Call middleware
    await protect(req as Request, res as Response, next);
    
    // Assertions
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle malformed authorization header', async () => {
    // Set request headers with malformed token
    req.headers = {
      authorization: 'Malformed-token-without-bearer',
    };
    
    // Call middleware
    await protect(req as Request, res as Response, next);
    
    // Assertions
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle database errors when finding user', async () => {
    // Setup valid token
    const userId = new mongoose.Types.ObjectId();
    
    // Mock jwt.verify to return decoded token
    (jwt.verify as jest.Mock).mockReturnValue({ id: userId });
    
    // Mock User.findById.select to throw error
    const selectMock = jest.fn().mockRejectedValue(new Error('Database error'));
    (User.findById as jest.Mock).mockReturnValue({
      select: selectMock
    });
    
    // Set request headers with token
    req.headers = {
      authorization: 'Bearer valid-token',
    };
    
    // Call middleware
    await protect(req as Request, res as Response, next);
    
    // Assertions
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, token failed' });
    expect(next).not.toHaveBeenCalled();
  });
});
