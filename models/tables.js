const Sequelize = require("sequelize");
const { db } = require("../index");

const Tables = db.define(
  "Tables",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tableNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    numberOfSets: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    isReserved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },

  {
    freezeTableName: true,
  }
);

module.exports.Tables = Tables;
