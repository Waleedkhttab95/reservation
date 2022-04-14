const tableServices = require("../services/tablesServices");
const authMiddleWare = require("../middleware/auth");
const ROLES = require("../middleware/roles");

module.exports = (app) => {
  app.post(
    "/api/table",
    authMiddleWare.auth,
    authMiddleWare.role([ROLES.Admin]),
    tableServices.addNewTable
  );

  app.get(
    "/api/table",
    authMiddleWare.auth,
    authMiddleWare.role([ROLES.Admin]),
    tableServices.getAllTables
  );

  app.delete(
    "/api/table",
    authMiddleWare.auth,
    authMiddleWare.role([ROLES.Admin]),
    tableServices.deleteTable
  );
};
