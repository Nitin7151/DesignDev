"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
// Connect to MongoDB
(0, database_1.default)();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
// API Routes
app.use('/api', apiRoutes_1.default);
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
exports.default = app;
