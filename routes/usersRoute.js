const router = require("express").Router();
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");
const { message } = require("antd");

//Register

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

//Login

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.send({
        message: "User Not Found",
        success: false,
        data: null,
      });
    }
    if (existingUser.isBlocked) {
      return res.send({
        message: "Your Acccount Is Blocked, Please Contact The Admin",
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
        message: "Password Incorrect",
        success: false,
        data: null,
      });
    }
    const token = jwt.sign(
      {
        userId: existingUser._id,
      },
      process.env.jwt_secret,
      {
        expiresIn: "1d",
      }
    );
    res.send({
      message: "User Logged In Successfully",
      success: true,
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
      user: user,
      success: true,
    });
  } catch (error) {
    return res.status(401).send({
      message: "Authentication Failed.",
      success: false,
    });
  }
});

//Get-All-Users

router.post("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.send({
      message: "Users Fetched Successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    return res.send({
      message: error.message,
      success: false,
      data: null,
    });
  }
});

// //get-user-by-id

// router.post("/get-user-by-id", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.body.userId);
//     res.send({
//       message: "User Fetched Successfully",
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     return res.send({
//       message: error.message,
//       success: false,
//       data: null,
//     });
//   }
// });
// Update user permissions
router.post("/update-user-permission", authMiddleware, async (req, res) => {
  const { selectedUserId, action } = req.body;

  if (!selectedUserId || !action) {
    return res
      .status(400)
      .send({ success: false, message: "User ID and action are required" });
  }

  try {
    const user = await User.findById(selectedUserId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }
    if (action === "toggleAdmin") {
      user.isAdmin = !user.isAdmin;
    } else if (action === "toggleBlock") {
      user.isBlocked = !user.isBlocked;
    } else {
      return res
        .status(400)
        .send({ success: false, message: "Invalid action" });
    }

    await user.save();

    return res.status(200).send({
      success: true,
      message: "User permission updated successfully",
      data: {
        selectedUserId: user._id,
        isAdmin: user.isAdmin,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("Error updating user permission:", error);
    return res.status(500).send({
      success: false,
      message: "Failed to update user permission",
      error: error.message,
    });
  }
});

//Update-user

router.post("/update-user", authMiddleware, async (req, res) => {
  // try {
  //   const user = await User.findById(req.body.userId);
  //   res.send({
  //     message: "User Fetched Successfully",
  //     success: true,
  //     data: user,
  //   });
  // } catch (error) {
  //   return res.send({
  //     message: error.message,
  //     success: false,
  //     data: null,
  //   });
  // }
});

module.exports = router;
