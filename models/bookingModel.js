const DataTypes = require("sequelize");
const sequelize = require("./database");
const Bus = requir("./busModels");
const User = require("./userModel");

const Booking = sequelize.define(
  "Booking",
  {
    busId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: Bus,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      reference: {
        model: User,
        key: "id",
      },
    },
    seats: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timesStamps: true,
  }
);

// Bus.hasMany(Booking, { foreignKey: "busId" });
// User.hasMany(Booking, { foreignKey: "userId" });
// Booking.belongsTo(Bus, { foreignKey: "busId" });
// Booking.belongsTo(User, { foreignKey: "userId" });

module.exports = Booking;
