import { createJWT } from "../auth/createJWT.js";
import { sendVerificationEmail } from "../auth/UserVerification.js";
import { pool } from '../config/db.js';
import { getUsers, getUserByEmail, signUp, verifyUser, uploadImage, getUserById, getUserPosts, GetVerifyUser } from "../model/users.js";
import bcrypt from 'bcrypt';
import uploadOnCloudinary from "../utility/cloudinary.js";
import { logger } from "../utility/logger.js";

export const getUsersController = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const userProfile = await getUserById(id);
        if (!userProfile) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(userProfile);
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const signUpController = async (req, res) => {
    try {
        const { first_name, last_name, date_of_birth, gender, email, password } = req.body;
        
        if (!first_name?.trim() || !last_name?.trim() || !date_of_birth || !gender || !email || !password) {
            return res.status(400).json({ 
                message: 'All fields are required' 
            });
        }

        if (typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ 
                message: 'Please enter a valid email address'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Password must be at least 6 characters long' 
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        
        const existingUser = await getUserByEmail(normalizedEmail);
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists with this email address' 
            });
        }

        const password_hash = await bcrypt.hash(password, 12);
        
        let username;
        let attempts = 0;
        do {
            const timestamp = Date.now().toString().slice(-4); 
            const random = Math.floor(Math.random() * 100).toString().padStart(2, '0'); 
            const code = timestamp + random; 
            username = first_name[0].toLowerCase() + last_name[0].toLowerCase() + code;
            
            const existingUsername = await verifyUser(username);
            if (!existingUsername) break;
            
            attempts++;
            if (attempts > 10) {
                throw new Error('Unable to generate unique username');
            }
        } while (true);
        
        await signUp(
            username, 
            first_name.trim(), 
            last_name.trim(), 
            date_of_birth, 
            gender, 
            normalizedEmail, 
            password_hash
        );
        
        await sendVerificationEmail(normalizedEmail, username);
        
        res.status(201).json({ 
            message: 'Verification email sent successfully. Please check your inbox.' 
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Registration failed. Please try again.' 
        });
    }
};

export const verifyUserController = async (req, res) => {
    try {
        const { otp } = req.body;
        const user = await verifyUser(otp);
        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        await GetVerifyUser(otp);
        const payload = {
            id : user.id,
            username : user.username,
            first_name : user.first_name,
            last_name : user.last_name,
            email : user.email,
            image : user.profile_picture_url,
            bio : user.bio,
            created_at : user.created_at,
            date_of_birth : user.date_of_birth,
            gender : user.gender,
            phone_number : user.phone_number,
            status : "Verified" 
        }
        
        createJWT(res, payload, '30d');
        
        return res.status(200).json(payload);
        
    }catch (error) {
        return res.status(500).json({ message: error.message });
    }
 };

 export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ 
                message: 'Please enter a valid email address'
            });
        }

        if (!password) {
            return res.status(400).json({ 
                message: 'Password is required' 
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await getUserByEmail(normalizedEmail);
        
        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid email or password' 
            });
        }

        if (user.status !== "Verified") {
            return res.status(400).json({ 
                message: 'Please verify your email before logging in' 
            });
        }

        const result = await bcrypt.compare(password, user.password_hash);
        if (!result) {
            return res.status(400).json({ 
                message: 'Invalid email or password' 
            });
        }

        const payload = {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            image: user.profile_picture_url,
            bio: user.bio,
            created_at: user.created_at,
            date_of_birth: user.date_of_birth,
            gender: user.gender,
            phone_number: user.phone_number,
            stutus : user.status
        };

        createJWT(res, payload, '30d');
        
        res.status(200).json(payload);

    } catch (error) {
        res.status(500).json({ 
            message: 'Login failed. Please try again.' 
        });
    }
 }


 export const uploadImageController = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        
        const result = await uploadOnCloudinary(req.file.buffer, req.file.originalname);
        
        if (!result || !result.url) {
            return res.status(500).json({ message: 'Failed to upload image to cloud storage' });
        }
        
        await uploadImage(id, result.url);
        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
 }

 export const logoutController = async (req, res) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
        });
        res.status(200).json({ message: 'Logged out successfully' });
    }catch ( error ) {
        res.status(500).json({ message: error.message });
    }
 }

 export const authCheckController = async (req,res) => {
    try{
        const user = req.user;
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
 };

export const getUserPostsController = async (req, res) => {
    const { userId } = req.params;
    const Id = req.user.id;
    if(Id != userId) {
        return res.status(403).json({ message: "You are not authorized to view this user's posts" });
    }

    try {
        const posts = await getUserPosts(userId);
        if (!posts) return res.status(404).json({ message: "No posts found for this user" });

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
