const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
    req.user = { id: user._id, email: user.email }; // Attach email to req.user
    next();
  } catch (err) {
    console.error('Error in authMiddleware:', err);
    return res.status(401).json({ error: 'Unauthorized: Token verification failed.' });
  }
};

module.exports = authMiddleware
