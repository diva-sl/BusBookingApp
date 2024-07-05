const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send({
      message: "Access Denied. No Token Provided.",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    res.status(400).send({
      message: "Invalid Token.",
      success: false,
    });
  }
};

module.exports = authMiddleware;
