const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const User = sequelize.define(
  "User",
  {
    name: {
      tyep: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      },
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      dafalutValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
