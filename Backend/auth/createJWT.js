import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const createJWT = (res, payload, expireIn) => {
    const secret = process.env.ACCESS_TOKEN;
    const token = jwt.sign(payload, secret, { expiresIn: expireIn });
    res.cookie("jwt", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV !== "development", 
        sameSite: "strict", 
        maxAge: 7*24*3600*1000
    });
    return token;
}