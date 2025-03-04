"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Determine if AI endpoints should be protected
const protectAiEndpoints = process.env.PROTECT_AI_ENDPOINTS === 'true'
    ? auth_1.protect
    : (req, res, next) => next();
// @route   POST /api/ai/template
// @desc    Generate template based on prompt
// @access  Protected or Public based on env variable
router.post('/template', protectAiEndpoints, aiController_1.generateTemplate);
// @route   POST /api/ai/chat
// @desc    Generate chat response
// @access  Protected or Public based on env variable
router.post('/chat', protectAiEndpoints, aiController_1.generateChat);
// @route   POST /api/ai/chat-stream
// @desc    Generate streaming chat response
// @access  Protected or Public based on env variable
router.post('/chat-stream', protectAiEndpoints, aiController_1.generateChatStream);
exports.default = router;
