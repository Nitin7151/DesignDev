import express, { Request, Response, NextFunction } from 'express';
import { generateTemplate, generateChat, generateChatStream } from '../controllers/aiController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Determine if AI endpoints should be protected
const protectAiEndpoints = process.env.PROTECT_AI_ENDPOINTS === 'true' 
  ? protect 
  : (req: Request, res: Response, next: NextFunction) => next();

//  ---------------------- POST /api/ai/template----template is selected here--------------------

router.post('/template', generateTemplate);

// -----------------------  POST /api/ai/chat------code is generated here----------------------------

router.post('/chat', protectAiEndpoints, generateChat);

// ------------------------ POST /api/ai/chat-stream----response comes in stream format------------------

router.post('/chat-stream', protectAiEndpoints, generateChatStream);

export default router;
