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
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/designdev';
        const options = {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4,
            connectTimeoutMS: 10000,
            autoIndex: true, // Enable indexes for better query performance
            maxPoolSize: 10
        };
        // In test environment, use test database
        if (process.env.NODE_ENV === 'test') {
            const testMongoURI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/designdev_test';
            yield mongoose_1.default.connect(testMongoURI, options);
            console.log('MongoDB connected successfully for testing');
        }
        else {
            yield mongoose_1.default.connect(mongoURI, options);
            console.log('MongoDB connected successfully');
        }
        // Add connection error handler
        mongoose_1.default.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
        // Add disconnection handler
        mongoose_1.default.connection.on('disconnected', () => {
            console.error('MongoDB disconnected. Attempting to reconnect...');
        });
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        // Exit process with failure if we can't connect to MongoDB
        process.exit(1);
    }
});
exports.default = connectDB;
