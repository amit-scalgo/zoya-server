import express from 'express';
import { getUserDetail } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const userRoute = express.Router();

userRoute.get('/profile', verifyToken, getUserDetail);
userRoute.get('/users', verifyToken, getAllUsers);

export default userRoute;
