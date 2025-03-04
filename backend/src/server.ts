require("dotenv").config();
import express from "express";
import cors from "cors";
import connectDB from "./config/database";
import apiRoutes from "./routes/apiRoutes";

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// For backward compatibility, redirect old endpoints to new API routes
app.post("/template", (req, res) => {
  res.redirect(307, '/api/ai/template');
});

app.post("/chat", (req, res) => {
  res.redirect(307, '/api/ai/chat');
});

app.post("/chat-stream", (req, res) => {
  res.redirect(307, '/api/ai/chat-stream');
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
