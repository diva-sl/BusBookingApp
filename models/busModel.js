const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Bus = sequelize.define("Bus", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  from: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  to: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  journeyData: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  depature: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arrival: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fare: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seatsBooked: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: [],
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Yet To Start",
  },
});

module.exports = Bus;
