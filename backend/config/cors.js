const cors = require('cors');

const corsOptions = {
  origin: '*', // Allow all origins (development only)
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

const configureCors = () => {
  return cors(corsOptions);
};

module.exports = configureCors;