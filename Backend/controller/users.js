import { createJWT } from "../auth/createJWT.js";
import { sendVerificationEmail } from "../auth/UserVerification.js";
import { getUsers, getUserByEmail, signUp, verifyUser, uploadImage, getUserById } from "../model/users.js";
import bcrypt from 'bcrypt';
import uploadOnCloudinary from "../utility/cloudinary.js";

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
        const user = await verifyUser(otp);
        if (!user) {
            res.status(400).json({ message: 'Invalid OTP' });
        }
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
            phone_number : user.phone_number
        }
        

        const token = createJWT(res, payload, '30d');
        res.status(200).json({token});
        
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
 };

 export const loginController = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        if(!user){
            res.status(400).json({ message: 'Please Sign-up first' });
            return;
        }
        const result = await bcrypt.compare(password, user.password_hash);
        if(!result){
            res.status(400).json({ message: 'Invalid Password' });
            return;
        }
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
            phone_number : user.phone_number
        }

        const token = createJWT(res, payload, '30d');
        res.status(200).json({token});

    }catch(error){
        res.status(500).json({ message: error.message });
    }
 }


 export const uploadImageController = async (req, res) => {
    try {
        const { id } = req.params;
        const LocalFilePath = req.file.path;
        const result = await uploadOnCloudinary(LocalFilePath);
        await uploadImage(id, result.url);
        res.status(200).json({ message: 'Image uploaded successfully'  });
    }catch ( error ) {
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
 }
 export const getUserProfileController = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// export const updateUserProfileController = async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const { first_name, last_name, bio, profile_picture_url } = req.body;

        
//         const updatedProfile = await updateUserProfile(userId, {
//             first_name,
//             last_name,
//             bio,
//             profile_picture_url,
//         });

//         if (!updatedProfile) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         res.status(200).json(updatedProfile);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };