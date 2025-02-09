import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const createJWT = (payload, expireIn) => {
    const secret = process.env.ACCESS_TOKEN;
    const token = jwt.sign(payload, secret, { expiresIn: expireIn });
    return token;
}