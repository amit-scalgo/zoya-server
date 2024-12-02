import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import { connectDB } from './lib/db/connection.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';

dotenv.config();

const app = express();

// Middleware
app.use(
    cors({
        origin: ['http://localhost:7777', 'https://zoya-web.vercel.app'],
        credentials: true,
    })
);

app.use(express.json());

// Connect to MongoDB database
connectDB();

// Routes
// Authentication routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/chat', chatRoute);

const server = app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`)
);

const io = new Server(server, {
    cors: {
        origin: [
            'http://localhost:7777',
            'https://zoya-web.vercel.app',
            'https://zoya-client.vercel.app',
        ],
        credentials: true,
    },
});

// ONLINE USERS
global.onlineUsers = new Map();

io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User added: ${userId}`);
        console.log('Current online users:', Array.from(onlineUsers.keys()));
        socket.emit('online-users', {
            onlineUsers: Array.from(onlineUsers.keys()),
        });
    });
    socket.on('signout', (id) => {
        onlineUsers.delete(id);
        socket.emit('online-users', {
            onlineUsers: Array.from(onlineUsers.keys()),
        });
    });

    // Handle outgoing call
    socket.on('outgoing-call', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('incoming-call', {
                from: data.from,
                signal: data.signal,
            });
        }
    });

    // Handle answer call
    socket.on('answer-call', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('call-accepted', data.signal);
        }
    });

    socket.on('reject-voice-call', (data) => {
        const sendUserSocket = onlineUsers.get(data.from);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('voice-call-rejected');
        }
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-recieve', {
                from: data.from,
                message: data.message,
            });
        }
    });

    socket.on('mark-read', ({ id, recieverId }) => {
        const sendUserSocket = onlineUsers.get(id);
        if (sendUserSocket) {
            socket
                .to(sendUserSocket)
                .emit('mark-read-recieve', { id, recieverId });
        }
    });
});
