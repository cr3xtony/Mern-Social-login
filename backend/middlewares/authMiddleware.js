const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return next(new ErrorHandler('Not Authorized Token Failed', 404));
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }
};

module.exports = protect;
