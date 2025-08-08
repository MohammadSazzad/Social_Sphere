import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (buffer, originalname) => {
    try {
        if (!buffer) return null;
        
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "social-sphere",
                    public_id: originalname.replace(/\.[^/.]+$/, "") // Remove extension
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            
            uploadStream.end(buffer);
        });
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

export default uploadOnCloudinary;