import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { generateStreamToken } from '../controllers/chat.controller.js';

const chatRoute = express.Router();

chatRoute.get('/generate-stream-token', verifyToken, generateStreamToken);

export default chatRoute;
