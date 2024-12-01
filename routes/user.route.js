import express from 'express';
import {
    getContactList,
    getUserDetail,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const userRoute = express.Router();

userRoute.get('/profile', verifyToken, getUserDetail);
userRoute.get('/list', verifyToken, getContactList);

export default userRoute;
