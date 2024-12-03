import User from '../models/user.model.js';

// PROFILE API
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

// USER DETAIL API
export const getUserDetailByid = async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await User.findById(uid).select('-password');
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

// UPDATE USER PROFILE
export const updateProfile = async (req, res) => {
    const { name, email, phoneNumber, avatar } = req.body;
    try {
        const loggedInUserId = req.user.id;
        const updatedUser = await User.findByIdAndUpdate(
            loggedInUserId,
            { name, email, phoneNumber, avatar },
            { new: true }
        ).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};
