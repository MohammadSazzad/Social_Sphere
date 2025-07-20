import multer from 'multer';

// Use memory storage to get file buffer
const storage = multer.memoryStorage();

export const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 4 * 1024 * 1024 // 4MB (Azure limit)
    },
    fileFilter: (req, file, cb) => {
        // Validate file types
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images are allowed'));
        }
    }
});