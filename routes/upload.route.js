import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/upload.controller.js';

const uploadRoute = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

uploadRoute.post('/file', upload.single('image'), uploadFile);

export default uploadRoute;
