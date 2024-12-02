import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
    addMessage,
    generateStreamToken,
    getMessages,
} from '../controllers/chat.controller.js';

const chatRoute = express.Router();

chatRoute.get('/generate-stream-token', verifyToken, generateStreamToken);
chatRoute.post('/add-message', addMessage);
chatRoute.get('/get-messages/:from/:to', getMessages);

export default chatRoute;
