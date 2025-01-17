const mongoose = require("mongoose");

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
      minlength: 8,
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
      minlength: 10,
      maxlength: 15,
    },
    dob: {
      type: Date,
      required: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
