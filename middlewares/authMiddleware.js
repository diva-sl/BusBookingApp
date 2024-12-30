const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];;

  if (!token) {
    return res.status(401).send({
      message: "Access Denied. No Token Provided.",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_secret);
    req.body.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(400).send({
      message: "Invalid Token.",
      success: false,
    });
  }
};

module.exports = authMiddleware;
