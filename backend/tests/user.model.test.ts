import mongoose from 'mongoose';
import User, { IUser } from '../src/models/User';
import bcrypt from 'bcrypt';

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

describe('User Model', () => {
  // Connect to MongoDB before tests
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/designdev_test');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  });

  // Clear users collection before each test
  beforeEach(async () => {
    try {
      await User.deleteMany({});
    } catch (error) {
      console.error('Error clearing users collection:', error);
    }
  });

  // Close database connection after tests
  afterAll(async () => {
    try {
      await mongoose.connection.close();
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
  });

  it('should create a new user successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);

    // Assertions
    expect(user).toBeTruthy();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password); // Password should be hashed
    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
  });

  it('should hash the password before saving', async () => {
    const plainPassword = 'password123';
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: plainPassword
    };

    const user = await User.create(userData);

    // Verify password is hashed
    expect(user.password).not.toBe(plainPassword);
    
    // Verify we can compare the password correctly
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    expect(isMatch).toBe(true);
  });

  it('should not rehash the password if not modified', async () => {
    // Create initial user
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);
    const originalHash = user.password;

    // Update user without changing password
    user.name = 'Updated Name';
    await user.save();

    // Password hash should remain the same
    expect(user.password).toBe(originalHash);
  });

  it('should compare password correctly with comparePassword method', async () => {
    const plainPassword = 'password123';
    const wrongPassword = 'wrongpassword';
    
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: plainPassword
    };

    const user = await User.create(userData);

    // Test correct password
    const isMatchCorrect = await user.comparePassword(plainPassword);
    expect(isMatchCorrect).toBe(true);

    // Test wrong password
    const isMatchWrong = await user.comparePassword(wrongPassword);
    expect(isMatchWrong).toBe(false);
  });

  it('should enforce email uniqueness', async () => {
    const userData = {
      name: 'Test User',
      email: 'duplicate@example.com',
      password: 'password123'
    };

    // Create first user
    await User.create(userData);

    // Try to create second user with same email
    try {
      await User.create(userData);
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Expect a duplicate key error
      expect(error).toBeTruthy();
      expect((error as any).code).toBe(11000); // MongoDB duplicate key error code
    }
  });

  it('should trim and lowercase email', async () => {
    const userData = {
      name: 'Test User',
      email: '  TEST@EXAMPLE.COM  ',
      password: 'password123'
    };

    const user = await User.create(userData);

    // Email should be trimmed and lowercased
    expect(user.email).toBe('test@example.com');
  });

  it('should trim name', async () => {
    const userData = {
      name: '  Test User  ',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await User.create(userData);

    // Name should be trimmed
    expect(user.name).toBe('Test User');
  });

  it('should enforce required fields', async () => {
    // Test missing name
    try {
      await User.create({
        email: 'test@example.com',
        password: 'password123'
      });
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeTruthy();
      expect((error as any).errors.name).toBeDefined();
    }

    // Test missing email
    try {
      await User.create({
        name: 'Test User',
        password: 'password123'
      });
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeTruthy();
      expect((error as any).errors.email).toBeDefined();
    }

    // Test missing password
    try {
      await User.create({
        name: 'Test User',
        email: 'test@example.com'
      });
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeTruthy();
      expect((error as any).errors.password).toBeDefined();
    }
  });

  it('should enforce minimum password length', async () => {
    try {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: '12345' // Too short (minimum is 6)
      });
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeTruthy();
      expect((error as any).errors.password).toBeDefined();
    }
  });
});
