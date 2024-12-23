const router = require("express").Router();
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");

router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(500).send({
        message: "User Already Exists",
        success: false,
        data: null,
      });
    }
    const hashedPassword = await bcrypt.hashSync(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    if (user) {
      return res.send({
        message: "User Created Successfully",
        success: true,
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.send({
        message: "User Not Found",
        success: false,
        data: null,
      });
    }
    const isCorrectPassword = await bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!isCorrectPassword) {
      return res.send({
        message: "User Not Found",
        success: false,
        data: null,
      });
    }
    const token = jwt.sign({
      id: existingUser._id,
      token: {
        expiresIn: "id",
      },
    });
    res.send({
      message: "User Logged In Successfully",
      seccess: true,
      data: token,
    });
  } catch (error) {
    res.send({
      message: error,
      success: false,
      data: null,
    });
  }
});

router.post("/getuser", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      message: "User Fetched Successfully",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(401).send({
      message: "Authentication Failed.",
      success: false,
    });
  }
});

module.exports = router;
