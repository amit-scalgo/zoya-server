import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';

const authRoute = express.Router();

// Register
authRoute.post('/register', registerUser);

// Login
authRoute.post('/login', loginUser);

export default authRoute;
