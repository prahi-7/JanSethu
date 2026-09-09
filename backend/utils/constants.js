const USER_ROLES = {
  CITIZEN: 'citizen',
  STUDENT: 'student',
  UNIVERSITY: 'university',
  ADMIN: 'admin',
  GOVERNMENT: 'government',
  INDUSTRY: 'industry'
};

const PROBLEM_CATEGORIES = [
  'Roads',
  'Water',
  'Electricity',
  'Sanitation',
  'Healthcare',
  'Education',
  'Transport',
  'Housing',
  'Environment',
  'Other'
];

const PROBLEM_STATUSES = [
  'Pending',
  'Under Review',
  'In Progress',
  'Solved',
  'Rejected',
  'Escalated'
];

const PROBLEM_PRIORITIES = [
  'Low',
  'Medium',
  'High',
  'Urgent'
];

const PROJECT_STATUSES = [
  'Idea',
  'In Progress',
  'Review',
  'Completed'
];

const TEAM_STATUSES = [
  'Forming',
  'Active',
  'Dissolved'
];

const SOLUTION_STATUSES = [
  'Proposed',
  'Accepted',
  'Rejected',
  'Implemented'
];

const FUNDING_STATUSES = [
  'Committed',
  'Disbursed',
  'Completed',
  'Cancelled'
];

const ESCALATION_STATUSES = [
  'Pending',
  'Processing',
  'Resolved',
  'Rejected'
];

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

const MESSAGES = {
  AUTH_SUCCESS: 'Authentication successful',
  AUTH_FAILED: 'Authentication failed',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Invalid token',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  USER_CREATED: 'User created successfully',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  USER_UPDATED: 'User updated successfully',
  PROBLEM_CREATED: 'Problem reported successfully',
  PROBLEM_UPDATED: 'Problem updated successfully',
  PROBLEM_DELETED: 'Problem deleted successfully',
  PROBLEM_NOT_FOUND: 'Problem not found',
  PROBLEMS_FETCHED: 'Problems fetched successfully',
  AI_ANALYSIS_COMPLETE: 'AI analysis complete',
  AI_FALLBACK_MODE: 'AI running in fallback mode',
  INTERNAL_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
  NOT_FOUND: 'Resource not found'
};

module.exports = {
  USER_ROLES,
  PROBLEM_CATEGORIES,
  PROBLEM_STATUSES,
  PROBLEM_PRIORITIES,
  PROJECT_STATUSES,
  TEAM_STATUSES,
  SOLUTION_STATUSES,
  FUNDING_STATUSES,
  ESCALATION_STATUSES,
  HTTP_STATUS,
  MESSAGES
};