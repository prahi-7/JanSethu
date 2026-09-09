const { HTTP_STATUS, MESSAGES } = require('../utils/constants');
const { formatResponse } = require('../utils/helpers');

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json(
        formatResponse(false, MESSAGES.UNAUTHORIZED, null, ['User not authenticated'])
      );
    }

    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json(
        formatResponse(false, MESSAGES.FORBIDDEN, null, [`Access denied for role: ${userRole}`])
      );
    }

    next();
  };
};

const isCitizen = roleCheck('citizen');
const isStudent = roleCheck('student');
const isUniversity = roleCheck('university');
const isAdmin = roleCheck('admin');
const isGovernment = roleCheck('government');
const isIndustry = roleCheck('industry');
const isCitizenOrStudent = roleCheck('citizen', 'student');
const isAdminOrGovernment = roleCheck('admin', 'government');

module.exports = {
  roleCheck,
  isCitizen,
  isStudent,
  isUniversity,
  isAdmin,
  isGovernment,
  isIndustry,
  isCitizenOrStudent,
  isAdminOrGovernment
};