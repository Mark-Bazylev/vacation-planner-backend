import express from "express";
import {
  addVacation,
  getVacation,
  getVacationsByPage,
  toggleFollowVacation,
  editVacation,
  deleteVacation,
  getVacationsReport,
} from "../controllers/vacations";

const router = express.Router();

router.route("/get/:id").get(getVacation);
router.route("/byPage").get(getVacationsByPage);
router.route("/report").get(getVacationsReport);
router.route("/follow/:id").post(toggleFollowVacation);
router.route("/add").post(addVacation);
router.route("/edit/:id").patch(editVacation);
router.route("/delete/:id").delete(deleteVacation);

export default router;
