const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // Check token exists
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).send({ errors: ['No token, authorization denied'] });
  }
  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).send({ errors: ['Token is not valid'] });
    process.exit(1);
  }
};
