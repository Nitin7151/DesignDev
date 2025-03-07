"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const auth_1 = require("./middleware/auth");
// Connect to MongoDB
(0, database_1.default)();
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? true // In production, accept requests from same origin
        : ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// API routes - make sure these come before static file serving
app.use('/api/auth', authRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
// Protected route example
app.get('/api/protected', auth_1.protect, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the static directory
    const staticPath = path_1.default.join(__dirname, 'static');
    console.log('Static files path:', staticPath);
    app.use(express_1.default.static(staticPath));
    // For any other route, serve the React index.html
    app.get('*', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api/')) {
            return next();
        }
        const indexPath = path_1.default.join(__dirname, 'static', 'index.html');
        console.log('Serving index.html from:', indexPath);
        res.sendFile(indexPath);
    });
}
const PORT = process.env.PORT || 3001;
// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
// Export the app for testing
exports.default = app;
