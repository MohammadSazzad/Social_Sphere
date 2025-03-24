import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized-No token provided' });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized-token is invalid' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Unauthorized' });   
    }
};