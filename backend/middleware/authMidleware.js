// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../model/userModel.js';

const  authenticate= async (req, res, next) => {
    let token;

    // Check if the token is present in cookies
    if (req.cookies && req.cookies.jwt) {
        try {
            // Get the token from cookies
            token = req.cookies.jwt;

            // Verify token and decode it
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            // Attach the user object to request (req.user)
            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export { authenticate };
