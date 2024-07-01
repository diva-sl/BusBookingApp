const { message } = require("antd");
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).send({
        message: "Auth Failed",
        sucess: "false",
      });
    }
    const decoded = jwt.verify(token, "token");
    console.log(decoded);
    req.body.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Auth Failed", success: false });
  }
};
