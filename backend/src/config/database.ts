import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // For testing purposes, we'll use a more flexible connection approach
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/designdev';
    console.log(mongoURI)
    // Set mongoose options to handle connection issues
    const options = {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s
      family: 4, // Use IPv4, skip trying IPv6
      connectTimeoutMS: 10000, // Give up initial connection after 10s
      autoIndex: false, // Don't build indexes
      maxPoolSize: 10 // Maintain up to 10 socket connections
    };
    
    // If we're in a test environment, use a more lenient approach
    if (process.env.NODE_ENV === 'test') {
      console.log('Using test database configuration');
      // In test mode, we'll continue even if MongoDB isn't available
      try {
        // For tests, use a specific test database
        const testMongoURI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/designdev_test';
        await mongoose.connect(testMongoURI, options);
        console.log('MongoDB connected successfully for testing');
      } catch (err) {
        console.warn('MongoDB connection failed for tests, continuing anyway:', err);
        // Don't exit in test mode
      }
    } else {
      // In development mode, we'll continue even if MongoDB isn't available
      try {
        await mongoose.connect(mongoURI, options);
        console.log('MongoDB connected successfully');
      } catch (err) {
        console.warn('MongoDB connection failed, continuing anyway:', err);
      }
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default connectDB;
