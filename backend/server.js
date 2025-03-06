const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// "images/" papkasini yaratish
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Multer sozlamalari
const storage = multer.diskStorage({
    destination: imagesDir,
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// API: Rasmlarni qabul qilish
app.post('/upload', upload.array('images', 5), (req, res) => {
    res.json({ message: 'Rasmlar saqlandi!', files: req.files });
});

// Static fayllarni xizmat qilish
app.use(express.static('frontend'));

// Serverni ishga tushirish
app.listen(PORT, () => {
    console.log(`Server ishlayapti: http://localhost:${PORT}`);
});
