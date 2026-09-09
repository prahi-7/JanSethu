const express = require('express');
const mongoose = require('mongoose');
const { formatResponse } = require('../utils/helpers');
const { HTTP_STATUS } = require('../utils/constants');

const router = express.Router();

router.get('/', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatus[dbState] || 'unknown',
      connected: dbState === 1
    },
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  };

  res.status(HTTP_STATUS.OK).json(
    formatResponse(true, 'Health check successful', health)
  );
});

router.get('/ready', async (req, res) => {
  const dbState = mongoose.connection.readyState;
  
  if (dbState !== 1) {
    return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json(
      formatResponse(false, 'Service not ready', { database: dbState })
    );
  }

  res.status(HTTP_STATUS.OK).json(
    formatResponse(true, 'Service is ready')
  );
});

module.exports = router;