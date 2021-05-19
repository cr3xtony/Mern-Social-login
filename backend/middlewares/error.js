const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  let error = { ...err };
  error.message = err.message;
  res.status(error.statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
