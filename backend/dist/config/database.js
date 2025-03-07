"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // For testing purposes, we'll use a more flexible connection approach
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/designdev';
        console.log(mongoURI);
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
                yield mongoose_1.default.connect(testMongoURI, options);
                console.log('MongoDB connected successfully for testing');
            }
            catch (err) {
                console.warn('MongoDB connection failed for tests, continuing anyway:', err);
                // Don't exit in test mode
            }
        }
        else {
            // In development mode, we'll continue even if MongoDB isn't available
            try {
                yield mongoose_1.default.connect(mongoURI, options);
                console.log('MongoDB connected successfully');
            }
            catch (err) {
                console.warn('MongoDB connection failed, continuing anyway:', err);
            }
        }
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
    }
});
exports.default = connectDB;
