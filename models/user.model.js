import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    avatar: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: 'user' },
    createdAt: { type: Date, default: Date.now },
    dedicatedSupportUserId: { type: String },
});

const User = mongoose.model('User', userSchema);
export default User;
