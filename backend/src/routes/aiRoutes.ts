import express, { Request, Response, NextFunction } from 'express';
import { generateTemplate, generateChat, generateChatStream } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Determine if AI endpoints should be protected
const protectAiEndpoints = process.env.PROTECT_AI_ENDPOINTS === 'true' 
  ? protect 
  : (req: Request, res: Response, next: NextFunction) => next();

// @route   POST /api/ai/template
// @desc    Generate template based on prompt
// @access  Protected or Public based on env variable
router.post('/template', protectAiEndpoints, generateTemplate);

// @route   POST /api/ai/chat
// @desc    Generate chat response
// @access  Protected or Public based on env variable
router.post('/chat', protectAiEndpoints, generateChat);

// @route   POST /api/ai/chat-stream
// @desc    Generate streaming chat response
// @access  Protected or Public based on env variable
router.post('/chat-stream', protectAiEndpoints, generateChatStream);

export default router;
