const { getFileUrl, getVideoUrl } = require('../config/multer');
const { HTTP_STATUS } = require('../utils/constants');
const { formatResponse } = require('../utils/helpers');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Upload single image
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, 'No file uploaded', null, ['Please select an image to upload'])
      );
    }

    const fileUrl = getFileUrl(req, req.file.filename);
    
    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Image uploaded successfully', {
        filename: req.file.filename,
        url: fileUrl,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      })
    );
  } catch (error) {
    logger.error('Upload image error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, 'Failed to upload image', null, [error.message])
    );
  }
};

// Upload multiple images
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, 'No files uploaded', null, ['Please select images to upload'])
      );
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      url: getFileUrl(req, file.filename),
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));
    
    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Images uploaded successfully', { files })
    );
  } catch (error) {
    logger.error('Upload images error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, 'Failed to upload images', null, [error.message])
    );
  }
};

// Upload video
const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, 'No video uploaded', null, ['Please select a video to upload'])
      );
    }

    const fileUrl = getVideoUrl(req, req.file.filename);
    
    res.status(HTTP_STATUS.OK).json(
      formatResponse(true, 'Video uploaded successfully', {
        filename: req.file.filename,
        url: fileUrl,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      })
    );
  } catch (error) {
    logger.error('Upload video error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, 'Failed to upload video', null, [error.message])
    );
  }
};

// Delete file
const deleteFile = async (req, res) => {
  try {
    const { filename, type } = req.params;
    
    if (!filename) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        formatResponse(false, 'Filename required', null, ['Please provide a filename'])
      );
    }

    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    const subDir = type === 'video' ? 'videos' : 'images';
    const filePath = path.join(uploadDir, subDir, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(HTTP_STATUS.OK).json(
        formatResponse(true, 'File deleted successfully')
      );
    } else {
      res.status(HTTP_STATUS.NOT_FOUND).json(
        formatResponse(false, 'File not found', null, ['File does not exist'])
      );
    }
  } catch (error) {
    logger.error('Delete file error:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(
      formatResponse(false, 'Failed to delete file', null, [error.message])
    );
  }
};

module.exports = {
  uploadImage,
  uploadImages,
  uploadVideo,
  deleteFile
};