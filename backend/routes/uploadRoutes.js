const express = require('express');
const router = express.Router();
const { upload } = require('../config/multer');
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');

// Upload routes (all require authentication)
router.post('/image', auth, upload.single('image'), uploadController.uploadImage);
router.post('/images', auth, upload.array('images', 10), uploadController.uploadImages);
router.post('/video', auth, upload.single('video'), uploadController.uploadVideo);
router.delete('/:type/:filename', auth, uploadController.deleteFile);

module.exports = router;