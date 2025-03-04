import request from 'supertest';
import app from '../src/server';
import mongoose from 'mongoose';
import User from '../src/models/User';
import jwt from 'jsonwebtoken';
import { generateToken } from '../src/config/jwt';

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

describe('Authentication Endpoints', () => {
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  };

  const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  };

  // Clear users collection before tests
  beforeAll(async () => {
    try {
      // Connect to the test database
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/designdev_test');
      
      // Clear all users
      await User.deleteMany({});
      console.log('Test database cleared');
    } catch (error) {
      console.error('Error setting up test database:', error);
    }
  });

  // Close database connection after tests
  afterAll(async () => {
    try {
      await mongoose.connection.close();
      console.log('Test database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  });

  // Test suite for signup endpoint
  describe('POST /api/auth/signup', () => {
    it('should register a new user and return token', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.email).toBe(testUser.email);
      
      // Verify token is valid JWT
      const decoded = jwt.decode(response.body.token);
      expect(decoded).toBeTruthy();
      expect(decoded).toHaveProperty('id');
    });

    it('should not register a user with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User already exists');
    });

    it('should validate required fields - missing email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Invalid User',
          password: 'password123'
          // Missing email
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      const emailError = response.body.errors.find((err: any) => 
        err.path === 'email' || err.param === 'email'
      );
      expect(emailError).toBeTruthy();
    });

    it('should validate required fields - missing password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Invalid User',
          email: 'invalid@example.com'
          // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      const passwordError = response.body.errors.find((err: any) => 
        err.path === 'password' || err.param === 'password'
      );
      expect(passwordError).toBeTruthy();
    });

    it('should validate required fields - missing name', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'invalid@example.com',
          password: 'password123'
          // Missing name
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      const nameError = response.body.errors.find((err: any) => 
        err.path === 'name' || err.param === 'name'
      );
      expect(nameError).toBeTruthy();
    });

    it('should validate password length', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Short Password User',
          email: 'short@example.com',
          password: '12345' // Too short
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      const passwordError = response.body.errors.find((err: any) => 
        err.path === 'password' || err.param === 'password'
      );
      expect(passwordError).toBeTruthy();
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Invalid Email User',
          email: 'not-an-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      const emailError = response.body.errors.find((err: any) => 
        err.path === 'email' || err.param === 'email'
      );
      expect(emailError).toBeTruthy();
    });
  });

  // Test suite for signin endpoint
  describe('POST /api/auth/signin', () => {
    it('should authenticate user and return token', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.email).toBe(testUser.email);
      
      // Verify token is valid JWT
      const decoded = jwt.decode(response.body.token);
      expect(decoded).toBeTruthy();
      expect(decoded).toHaveProperty('id');
    });

    it('should not authenticate with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should not authenticate with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: testUser.password
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should validate required fields - missing email', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          password: 'password123'
          // Missing email
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should validate required fields - missing password', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'test@example.com'
          // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  // Test suite for profile endpoint
  describe('GET /api/auth/profile', () => {
    let token: string;

    // Get token before profile tests
    beforeAll(async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      token = response.body.token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Not authorized, token failed');
    });

    it('should not get profile with malformed token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearermalformedtoken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });

    it('should not get profile with expired token', async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { id: '507f1f77bcf86cd799439011' }, // Using a fake MongoDB ObjectId
        process.env.JWT_SECRET || 'your_jwt_secret_key',
        { expiresIn: '0s' } // Expire immediately
      );

      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
    });
  });

  // Test suite for protected route
  describe('GET /api/auth/profile', () => {
    let token: string;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          email: testUser.email,
          password: testUser.password
        });

      token = response.body.token;
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('This is a protected route');
      expect(response.body).toHaveProperty('user');
    });

    it('should not access protected route without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should not access protected route with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtoken');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Not authorized, token failed');
    });
  });

  // Test JWT token generation and verification
  describe('JWT Token Functions', () => {
    it('should generate a valid token', async () => {
      // Create a mock user
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Mock User',
        email: 'mock@example.com',
        password: 'hashedpassword'
      } as any;

      const token = generateToken(mockUser);
      expect(token).toBeTruthy();
      
      // Verify token contains expected payload
      const decoded = jwt.decode(token) as any;
      expect(decoded).toBeTruthy();
      expect(decoded.id.toString()).toBe(mockUser._id.toString());
      expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });
  });
});
