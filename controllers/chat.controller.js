import { StreamChat } from 'stream-chat';
import User from '../models/user.model.js';
import Message from '../models/message.model.js';

const apiKey = process.env.STREAM_APIKEY;
const secret = process.env.STREAM_SECRET;

export const generateStreamToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userId = user._id.toString();
        const serverClient = StreamChat.getInstance(apiKey, secret);
        const token = serverClient.createToken(userId);

        res.status(200).json({
            token: token,
        });
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { from, to } = req.params;

        // Fetch messages between two users
        const messages = await Message.find({
            $or: [
                { senderId: from, recieverId: to },
                { senderId: to, recieverId: from },
            ],
        }).sort({ createdAt: 'asc' });

        // Mark unread messages as read
        const unreadMessages = messages.filter(
            (message) =>
                message.messageStatus !== 'read' && message.senderId === to
        );

        if (unreadMessages.length > 0) {
            await Message.updateMany(
                { _id: { $in: unreadMessages.map((msg) => msg._id) } },
                { messageStatus: 'read' }
            );
        }

        return res.status(200).json({ messages });
    } catch (error) {
        console.error('Error fetching messages:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const addMessage = async (req, res) => {
    try {
        const { message, from, to } = req.body;

        if (!message || !from || !to) {
            return res
                .status(400)
                .json({ message: 'From, to, and message are required.' });
        }

        const recipientUser = await User.findById(to);
        const messageStatus = recipientUser ? 'delivered' : 'sent';

        // Create a new message
        const newMessage = await Message.create({
            message,
            senderId: from,
            recieverId: to,
            messageStatus,
        });

        return res.status(201).json({ message: newMessage });
    } catch (error) {
        console.error('Error adding message:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
};
