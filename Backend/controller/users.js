import { createJWT } from "../auth/createJWT.js";
import { sendVerificationEmail } from "../auth/UserVerification.js";
import { getUsers, getUserByEmail, signUp, verifyUser } from "../model/users.js";
import bcrypt from 'bcrypt';

export const getUsersController = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const signUpController = async (req, res) => {
    try {
        const { first_name, last_name, date_of_birth, gender, email, password } = req.body;
        const password_hash = await bcrypt.hash(password, 10);
        const user = await getUserByEmail(email);
        if (user) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const username = first_name[0]+last_name[0] + code;
        console.log (username);
        await signUp(username, first_name, last_name, date_of_birth, gender, email, password_hash);
        await sendVerificationEmail(email, username);
        res.status(201).json({ message: 'Verification Email Send Successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

export const verifyUserController = async (req, res) => {
    try {
        const { otp } = req.body;
        const result = await verifyUser(otp);
        if (!result) {
            res.status(400).json({ message: 'Invalid OTP' });
        }
        const payload = {
            id : result.id,
            username : result.username,
            first_name : result.first_name,
            last_name : result.last_name,
            email : result.email,
            image : result.profile_picture_url,
            bio : result.bio,
            created_at : result.created_at,
            date_of_birth : result.date_of_birth,
            gender : result.gender,
            phone_number : result.phone_number
        }
        
        const token = createJWT(payload, '30d');
        res.status(200).json({token});
        
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
 };

 

