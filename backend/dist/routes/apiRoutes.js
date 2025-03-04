"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const aiRoutes_1 = __importDefault(require("./aiRoutes"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Auth routes
router.use('/auth', authRoutes_1.default);
// AI routes
router.use('/ai', aiRoutes_1.default);
// Protected routes example
router.get('/protected', auth_1.protect, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});
exports.default = router;
