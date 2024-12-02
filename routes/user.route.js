import express from 'express';
import { getAllUsers, getUserDetail } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const userRoute = express.Router();

userRoute.get('/profile', verifyToken, getUserDetail);
userRoute.get('/list', verifyToken, getAllUsers);

export default userRoute;
