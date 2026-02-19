const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/subcompany";
        // Create folder if it doesn't exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Cleaning filename to avoid issues with special characters
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, "subcompany-" + uniqueSuffix + path.extname(file.originalname));
    }
});

module.exports = multer({ storage });