const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // Check token exists
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ errors: 'No token, authorization denied' });
  }
  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Token is not valid' });
    process.exit(1);
  }
};
