const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const users = [
  {
    username: 'hokimiyat_yordamchisi',
    passwordHash: bcrypt.hashSync('12345', 10),
    role: 'hokimiyat'
  },
  {
    username: 'monitoring',
    passwordHash: bcrypt.hashSync('12345', 10),
    role: 'monitoring'
  }
];

router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = users.find((item) => item.username === username);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = jwt.sign(
      {
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      role: user.role
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
