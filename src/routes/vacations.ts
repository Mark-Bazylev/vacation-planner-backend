import express from "express";
import {
  addVacation,
  getVacation,
  getVacationsByPage,
  toggleFollowVacation,
  editVacation,
  deleteVacation,
  getVacationsReport,
  bookVacation,
  getBookedVacation,
  setBookingStatus,
  bookingsCleanup,
} from "../controllers/vacations";

const router = express.Router();

router.route("/get/:id").get(getVacation);
router.route("/byPage").get(getVacationsByPage);
router.route("/report").get(getVacationsReport);
router.route("/follow/:id").post(toggleFollowVacation);
router.route("/add").post(addVacation);
router.route("/edit/:id").patch(editVacation);
router.route("/delete/:id").delete(deleteVacation);

router.route("/book/:id").post(bookVacation);
router.route("/bookedVacations").get(getBookedVacation);

router.route("/setBookingStatus/:id").post(setBookingStatus);

router.route("/rejectExpiredStatus").get(bookingsCleanup);

export default router;
