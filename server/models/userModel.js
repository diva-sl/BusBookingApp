const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 15,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    address: {
      doorNo: {
        type: String,
        required: false,
      },
      street: {
        type: String,
        required: false,
      },
      place: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      postalCode: {
        type: String,
        required: false,
      },
    },
    phone: {
      type: String,
      required: false,
      validate: {
        validator: function (value) {
          return !value || /^[0-9]{10,15}$/.test(value);
        },
        message: "Phone number must be between 10 and 15 digits.",
      },
    },
    dob: {
      type: Date,
      required: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    avatarColor: {
      type: String,
      default: () => `#${crypto.randomBytes(3).toString("hex")}`,
    },
    avatarInitial: {
      type: String,
      default: function () {
        return this.name.charAt(0).toUpperCase();
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
