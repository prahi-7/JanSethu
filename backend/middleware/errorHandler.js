const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const { formatResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(
      formatResponse(false, MESSAGES.VALIDATION_ERROR, null, errors)
    );
  }

  if (err.name === 'CastError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      formatResponse(false, 'Invalid ID format', null, ['The provided ID is invalid'])
    );
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(HTTP_STATUS.CONFLICT).json(
      formatResponse(false, 'Duplicate entry', null, [`${field} already exists`])
    );
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(
      formatResponse(false, 'File too large', null, ['File size exceeds limit'])
    );
  }

  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.isOperational ? err.message : MESSAGES.INTERNAL_ERROR;
  
  return res.status(statusCode).json(
    formatResponse(false, message, null, [err.message])
  );
};

module.exports = errorHandler;