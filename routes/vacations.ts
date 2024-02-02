import express from "express";

const router = express.Router();

import {
  addVacation,
  addManyVacations,
  getVacation,
  getVacationsByPage,
  toggleFollowVacation,
} from "../controllers/vacations";

router.route("/get/:id").get(getVacation);
router.route("/byPage").get(getVacationsByPage);
router.route("/follow/:id").post(toggleFollowVacation);
router.route("/add").post(addVacation);
router.route("/addMany").post(addManyVacations);

export default router;
