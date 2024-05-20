'use strict'

const express = require('express');
<<<<<<< HEAD
const ShopController = require('../controllers/shop.controller');
const ErrorMiddleware = require('../middlewares/error.middleware');

const router = express.Router();

router.get('/get-image', ErrorMiddleware.asyncHandler(ShopController.getImage));
=======
const AuthenticationMiddleware = require('../middlewares/auth.middleware');
const ErrorMiddleware = require('../middlewares/error.middleware');
const ImageController = require('../controllers/image.controller');
const multer = require('multer');
const router = express.Router();

const path = require('path');

// Set up multer, destination and filename determine where and what the file will be saved as
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../images/'));
    },
    filename: function(req, file, cb) {
        cb(null, Date.now().toString() + path.extname(file.originalname));
    }
});

// Filter files based on their type
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// Initialize multer with the storage and fileFilter
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // Limit file size to 5MB
    },
    fileFilter: fileFilter
});
router.use(ErrorMiddleware.asyncHandler(AuthenticationMiddleware.authentication));

router.post('/upload', upload.single('file'), ErrorMiddleware.asyncHandler(ImageController.upload));
router.post('/delete/:id', ErrorMiddleware.asyncHandler(ImageController.delete));
>>>>>>> main

module.exports = router;