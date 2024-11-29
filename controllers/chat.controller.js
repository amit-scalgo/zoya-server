import { StreamChat } from 'stream-chat';
import User from '../models/user.model.js';

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
