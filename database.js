const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bus", "div", "div", {
  host: "localhost",
  dialect: "postgres",
});

module.exports = sequelize;
