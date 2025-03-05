"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const auth_1 = require("./middleware/auth");
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
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Mount routes directly
app.use('/api/auth', authRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
// Protected route example
app.get('/api/protected', auth_1.protect, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});
// These routes are now directly handled by aiRoutes
const PORT = process.env.PORT || 3001;
// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
// Export the app for testing
exports.default = app;
