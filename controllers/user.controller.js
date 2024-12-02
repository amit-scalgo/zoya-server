import User from '../models/user.model.js';

// USER DETAIL API
export const getUserDetail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET ALL USERS
export const getContactList = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const loggedInUser = await User.findById(loggedInUserId);
        const { role, dedicatedSupportUserId } = loggedInUser;

        let users = [];
        if (role === 'user') {
            users = await User.find({
                _id: dedicatedSupportUserId,
                role: { $ne: role },
            }).select('-password');
        } else if (role === 'support') {
            users = await User.find({
                _id: { $ne: loggedInUserId },
                role: { $ne: role },
            }).select('-password');
        } else {
            users = await User.find({
                _id: { $ne: loggedInUserId },
            }).select('-password');
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
