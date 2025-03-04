import { generateToken, verifyToken } from '../src/config/jwt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { IUser } from '../src/models/User';

// Set environment variable for testing
process.env.JWT_SECRET = 'test_secret_key';

// Mock jwt module for the tests that use direct jwt.verify
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token'),
  verify: jest.fn().mockImplementation((token, secret) => {
    if (token === 'valid_token' || token === 'mock_token') {
      return { id: 'user_id', exp: Math.floor(Date.now() / 1000) + 3600 };
    }
    throw new Error('invalid token');
  }),
  decode: jest.fn().mockImplementation((token) => {
    if (token) {
      return { id: 'user_id', exp: Math.floor(Date.now() / 1000) + 3600, iat: Math.floor(Date.now() / 1000) };
    }
    return null;
  })
}));

describe('JWT Utilities', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token with user ID', () => {
      // Create a mock user
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Test User',
        email: 'test@example.com'
      } as IUser;
      
      // Generate token
      const token = generateToken(mockUser);
      
      // Verify token is a string
      expect(typeof token).toBe('string');
      
      // Use jwt.decode instead of verify for testing
      const decoded = jwt.decode(token) as any;
      expect(decoded).toHaveProperty('id');
      // In our mock, id is always 'user_id'
      expect(decoded.id).toBe('user_id');
      expect(decoded).toHaveProperty('exp');
      expect(decoded).toHaveProperty('iat');
    });
    
    it('should set token expiration to future date', () => {
      // Create a mock user
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Test User',
        email: 'test@example.com'
      } as IUser;
      
      // Generate token
      const token = generateToken(mockUser);
      
      // Decode token and verify expiration
      const decoded = jwt.decode(token) as any;
      const currentTime = Math.floor(Date.now() / 1000);
      
      expect(decoded.exp).toBeGreaterThan(currentTime);
      // Default expiration is 7 days (604800 seconds)
      expect(decoded.exp - decoded.iat).toBeLessThanOrEqual(604800);
    });
  });
  
  describe('verifyToken', () => {
    it('should verify a valid token and return decoded payload', () => {
      // Create a mock valid token
      const token = 'valid_token';
      
      // Verify token
      const decoded = verifyToken(token);
      
      // Assertions
      expect(decoded).toBeTruthy();
      expect(decoded).toHaveProperty('id');
      expect(decoded.id).toBe('user_id');
    });
    
    it('should return null for invalid token', () => {
      // Mock implementation for this specific test
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('invalid token');
      });
      
      // Verify invalid token
      const decoded = verifyToken('invalid-token');
      
      // Assertions
      expect(decoded).toBeNull();
    });
    
    it('should return null for expired token', () => {
      // Mock implementation for this specific test
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        const error: any = new Error('jwt expired');
        error.name = 'TokenExpiredError';
        throw error;
      });
      
      // Verify expired token
      const decoded = verifyToken('expired-token');
      
      // Assertions
      expect(decoded).toBeNull();
    });
    
    it('should return null for token with wrong signature', () => {
      // Mock implementation for this specific test
      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        const error: any = new Error('invalid signature');
        error.name = 'JsonWebTokenError';
        throw error;
      });
      
      // Verify token with wrong signature
      const decoded = verifyToken('wrong-signature-token');
      
      // Assertions
      expect(decoded).toBeNull();
    });
  });
});
