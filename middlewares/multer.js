import multer from "multer";

// Disk storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // folder must exist
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + "_" + file.originalname);
    }
});

// Multer instance
const upload = multer({ storage });

export default upload;
