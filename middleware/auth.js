const jwt = require('jsonwebtoken');

// Middleware สำหรับตรวจสอบความถูกต้องของ JWT Token โดยใช้ token ชื่อ "admin"
const authenticateAdminToken = (req, res, next) => {
  // ดึง JWT Token ออกมาจาก Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized', success: false });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid token', success: false });
    }

    if (user.role !== 'admin') {
      return res.status(403).send({ message: 'Access forbidden', success: false });
    }

    req.user = user; 
    next();
  });
};

module.exports = { authenticateAdminToken };
