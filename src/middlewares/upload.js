const multer = require("multer");
const path = require("path");
const fs = require("fs");

const sliderUploadPath = path.join(__dirname, "../../uploads/sliders");

// ✅ Ensure folder exists
if (!fs.existsSync(sliderUploadPath)) {
    fs.mkdirSync(sliderUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, sliderUploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"), false);
        }
        cb(null, true);
    }
});

module.exports = upload;
