import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendVerificationEmail = async (email, code) => {
    try{
        const transporter = nodemailer.createTransport({
            host : 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
    
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is ${code}`
        }
    
        const info = await transporter.sendMail(mailOptions);
        console.log(`Message sent: ${info.messageId}`);
    }catch(error){
        console.log(error);
    }
};