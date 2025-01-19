const express = require("express");
const router = express.Router();
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

// Helper function to save Base64 images
const saveBase64Image = (base64String, uploadDir) => {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid Base64 string");

  const mimeType = matches[1];
  const base64Data = matches[2];
  const extension = mimeType.split("/")[1];

  if (!["jpeg", "png", "jpg"].includes(extension)) {
    throw new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed.");
  }

  const fileName = `profile_${Date.now()}.${extension}`;
  const filePath = path.join(uploadDir, fileName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  fs.writeFileSync(filePath, base64Data, "base64");
  return `/uploads/profile-pictures/${fileName}`;
};

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
});

// Register User

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

// Login User

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

//get user

router.post("/getuser", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
        data: null,
      });
    }

    if (user.profilePicture) {
      const filePath = path.join(__dirname, "..", user.profilePicture);

      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = path.extname(filePath).slice(1);
        user.profilePicture = `data:image/${mimeType};base64,${fileBuffer.toString(
          "base64"
        )}`;
      }
    }

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

// Get Profile

router.post("/get-profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userProfile = {
      ...user.toObject(),
      dob: user.dob ? moment(user.dob).format("YYYY-MM-DD") : "",
      profilePicture: "",
    };

    if (user.profilePicture) {
      const filePath = path.join(__dirname, "..", user.profilePicture);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        const mimeType = path.extname(filePath).slice(1);
        userProfile.profilePicture = `data:image/${mimeType};base64,${fileBuffer.toString(
          "base64"
        )}`;
      }
    }

    res.status(200).json({ success: true, user: userProfile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile", error });
  }
});

// Update Profile
router.post(
  "/update-profile",
  upload.none(),
  authMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        dob,
        address,
        profilePicture,
        removeProfilePicture,
        userId,
        password,
        newPassword,
      } = req.body;

      const updateData = {
        name,
        email,
        phone,
        dob,
        address: address ? JSON.parse(address) : undefined,
      };

      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (newPassword) {
        if (!password) {
          return res
            .status(400)
            .json({ success: false, message: "Current password is required" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ success: false, message: "Incorrect current password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        updateData.password = hashedNewPassword;
      }

      const uploadDir = path.join(__dirname, "../uploads/profile-pictures");

      if (profilePicture) {
        const newFilePath = saveBase64Image(profilePicture, uploadDir);
        if (user.profilePicture) {
          const oldFilePath = path.join(__dirname, "..", user.profilePicture);
          deleteFile(oldFilePath);
        }
        updateData.profilePicture = newFilePath;
      } else if (removeProfilePicture === "true") {
        if (user.profilePicture) {
          const oldFilePath = path.join(__dirname, "..", user.profilePicture);
          deleteFile(oldFilePath);
        }
        updateData.profilePicture = "";
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

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
