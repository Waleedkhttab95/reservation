const authMiddleWare = require("../middleware/auth");
const ROLES = require("../middleware/roles");
const reservationServices = require("../services/reservationServices");

module.exports = (app) => {
  app.get("/api/checkSlots",
  authMiddleWare.auth,
  authMiddleWare.role(['Admin' , 'Employee']),
   reservationServices.checkSlots);

  app.post(
    "/api/reserve-time-slot",
    authMiddleWare.auth,
    authMiddleWare.role(['Admin' , 'Employee']),
    reservationServices.reserveTimeSlot
  );

  app.get(
    "/api/get-all-reservations",
    authMiddleWare.auth,
    authMiddleWare.role([ROLES.Admin]),
    reservationServices.getAllReservations
  );

  app.get(
    "/api/get-day-reservations",
    authMiddleWare.auth,
    authMiddleWare.role(['Admin' , 'Employee']),
    reservationServices.getTodayReservations
  );

  app.delete(
    "/api/delete-reservation",
    authMiddleWare.auth,
    authMiddleWare.role(['Admin' , 'Employee']),
    reservationServices.deleteReservation
  );
};
