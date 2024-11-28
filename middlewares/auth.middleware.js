import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    try {
        const token =
            req?.cookies?.token || req.headers.authorization.split(' ')[1];
        console.log('request', token);
        if (!token) {
            return res
                .status(401)
                .json({ message: 'Unauthorized: No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('req', req.user);
        next();
    } catch (error) {
        console.error('Error verifying token:', error.message);
        res.status(403).json({ message: 'Invalid or expired token' });
    }
};
