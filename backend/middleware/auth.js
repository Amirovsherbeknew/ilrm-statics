const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'mock-backend-secret';

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    req.user = jwt.verify(header.split(' ')[1], JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = {
  auth,
  JWT_SECRET
};
