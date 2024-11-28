import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './lib/db/connection.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
dotenv.config();

const app = express();

// Middleware
app.use(
    cors({
        origin: ['http://localhost:7777'],
        credentials: true,
    })
);

app.use(express.json());

// Connect to MongoDB database
connectDB();

// Routes
// Authentication routes
app.use('/auth', authRoute);
app.use('/user', userRoute);

const server = app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);
