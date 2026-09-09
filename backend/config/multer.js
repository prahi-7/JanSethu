const multer = require('multer');

// Store uploaded files temporarily in memory.
// They will be sent to Cloudinary by our upload helper.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp'
  ];

  const allowedVideoTypes = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm',
    'video/x-msvideo'
  ];

  // Project/document file types
  const allowedDocumentTypes = [
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

  const allowedTypes = [
    ...allowedImageTypes,
    ...allowedVideoTypes,
    ...allowedDocumentTypes
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not supported: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600,
    files: 10
  }
});

module.exports = {
  upload
};