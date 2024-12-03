import express from 'express';
import {
    getContactList,
    getUserDetail,
    getUserDetailByid,
    updateProfile,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const userRoute = express.Router();

userRoute.get('/profile', verifyToken, getUserDetail);
userRoute.get('/detail/:uid', verifyToken, getUserDetailByid);
userRoute.patch('/profile', verifyToken, updateProfile);
userRoute.get('/list', verifyToken, getContactList);

export default userRoute;
