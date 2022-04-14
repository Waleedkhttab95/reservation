const Sequelize = require("sequelize");
const { db } = require("../index");

const reservations = db.define(
  "reservations",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    tableNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    reservationStatus: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
  }
);

console.log(db.models);

module.exports.Reservations = reservations;
