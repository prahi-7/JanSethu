const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: options.folder || 'jansethu',
      resource_type: options.resourceType || 'auto',
      public_id: options.publicId,
    };

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = {
  uploadToCloudinary,
};