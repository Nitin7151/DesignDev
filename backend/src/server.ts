require("dotenv").config();
import express from "express";
import cors from "cors";
import connectDB from "./config/database";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import { protect } from "./middleware/auth";

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'http://localhost:5173'
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount routes directly
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Protected route example
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

const PORT = process.env.PORT || 3001;

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the app for testing
export default app;
