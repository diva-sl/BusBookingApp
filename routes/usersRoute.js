const router = require("express").Router();
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");
const { message } = require("antd");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

//Register

router.post("/register", async (req, res, next) => {
  const { name, email, password, address } = req.body;
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
      address: address || {},
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

// get-profile

router.post("/get-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const formattedDob = moment(user.dob).format("YYYY-MM-DD");

    const { password, ...userProfile } = user.toObject();
    userProfile.dob = formattedDob;

    res.status(200).json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile", error });
  }
});

// Configure multer for file uploads

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads/profile-pictures");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true }); // Create directory if it doesn't exist
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."));
    } else {
      cb(null, true);
    }
  },
});

// Update user profile

router.post(
  "/update-profile",
  upload.single("profilePicture"),
  authMiddleware,
  async (req, res) => {
    try {
      const { name, email, phone, dob, address } = req.body;
      const updateData = {
        name,
        email,
        phone,
        dob,
        address: address ? JSON.parse(address) : undefined,
      };

      if (req.file) {
        updateData.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.body.userId,
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update profile", error });
    }
  }
);

module.exports = router;
