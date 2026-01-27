import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Define where to save the files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Check if 'uploads' folder exists, if not create it
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // 2. Generate a unique filename (Timestamp + Random Number + Extension)
    // Example: 17098823_992_image.png
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// 3. Filter to accept only Images
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, webp) are allowed!'));
  }
};

// 4. Create the Multer Instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter,
});

export default upload;