const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;


exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) throw new Error();

    const decoded = jwt.verify(token, jwtSecret);
    req.user = await User.findById(decoded.id);
    if (!req.user) throw new Error();

    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
