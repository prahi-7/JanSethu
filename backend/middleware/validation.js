const { validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../utils/constants');
const { formatResponse } = require('../utils/helpers');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => err.msg);
    
    return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(
      formatResponse(false, 'Validation failed', null, errorMessages)
    );
  };
};

module.exports = validate;