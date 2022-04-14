const Sequelize = require("sequelize");
const { db } = require("../index");

const Users = db.define(
  "Users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    employeeName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roles: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

console.log(db.models); // true

module.exports = Users;
