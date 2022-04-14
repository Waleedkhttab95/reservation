const authServices = require("../services/authServices");
const authMiddleWare = require("../middleware/auth");
const ROLES = require("../middleware/roles");

module.exports = (app) => {
  app.post("/api/sign-in", authServices.signin);

  app.post("/api/new-employee", authServices.signup);
};
