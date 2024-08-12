// routes/upload.js
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const conn = mongoose.connection;

// Create a local directory for uploads if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Configure Multer storage for local and GridFS
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Upload file route
router.post('/upload', upload.single('file'), (req, res) => {
    const localFilePath = path.join(uploadDir, req.file.filename);

    // Save file to GridFS
    const writestream = gfs.createWriteStream({
        filename: req.file.filename,
        content_type: req.file.mimetype
    });

    fs.createReadStream(localFilePath).pipe(writestream);

    writestream.on('close', (file) => {
        res.json({ file });
    });

    writestream.on('error', (err) => {
        res.status(500).json({ error: err.message });
    });
});

// Get file route
router.get('/files/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({ err: 'No file exists' });
        }

        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({ err: 'Not an image' });
        }
    });
});

module.exports = router;
