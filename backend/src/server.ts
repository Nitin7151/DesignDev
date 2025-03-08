require("dotenv").config();
import express from "express";
import cors from "cors";
import path from "path";
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
    ? true  // In production, accept requests from same origin
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Add Cross-Origin Isolation headers for WebContainer support
app.use((req, res, next) => {
  // These headers are required for SharedArrayBuffer and WebContainer
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

// API routes - make sure these come before static file serving
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Protected route example
app.get('/api/protected', protect, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  // Include the current headers in the response for debugging
  const headers = {
    'cross-origin-embedder-policy': res.getHeader('Cross-Origin-Embedder-Policy'),
    'cross-origin-opener-policy': res.getHeader('Cross-Origin-Opener-Policy')
  };
  
  res.json({ 
    status: 'ok',
    headers,
    crossOriginIsolated: true
  });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the static directory
  const staticPath = path.join(__dirname, 'static');
  console.log('Static files path:', staticPath);
  app.use(express.static(staticPath));
  
  // For any other route, serve the React index.html
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next();
    }
    const indexPath = path.join(__dirname, 'static', 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath);
  });
}

const PORT = process.env.PORT || 3001;

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Cross-Origin Isolation is enabled for WebContainer support`);
    });
}

// Export the app for testing
export default app;
