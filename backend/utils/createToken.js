import jwt from 'jsonwebtoken';

// Secret key for signing the token (make sure to keep it safe)
const generateToken=(res,userId)=>{

    const secretKey = process.env.JWT_SECRET_KEY;

    // Generate the JWT token
    const token = jwt.sign({userId}, secretKey, { expiresIn: '30d' });

    // Send JWT as HttpOnly cookie
    res.cookie('jwt', token, {
        httpOnly: true, // Prevents access from client-side JavaScript
        secure: process.env.NODE_ENV !='development',   // Ensures the cookie is sent over HTTPS (use in production)
        sameSite: 'strict', // Helps prevent CSRF attacks
        maxAge: 30*24*60*60*1000, // Cookie expires in 1 hour
    });

    return token

}
export default generateToken;

