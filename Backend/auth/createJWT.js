import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

<<<<<<< HEAD
export const createJWT = (payload, expireIn) => {
    const secret = process.env.ACCESS_TOKEN;
    const token = jwt.sign(payload, secret, { expiresIn: expireIn });
=======
export const createJWT = (res, payload, expireIn) => {
    const secret = process.env.ACCESS_TOKEN;
    const token = jwt.sign(payload, secret, { expiresIn: expireIn });
    res.cookie("jwt", token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV !== "development", 
        sameSite: "strict", 
        maxAge: 7*24*3600*1000
    });
>>>>>>> 7f826afbd4d82d70e90c4278383f16e0070a0add
    return token;
}