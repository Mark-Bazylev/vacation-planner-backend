"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vacations_1 = require("../controllers/vacations");
const router = express_1.default.Router();
router.route("/get/:id").get(vacations_1.getVacation);
router.route("/byPage").get(vacations_1.getVacationsByPage);
router.route("/report").get(vacations_1.getVacationsReport);
router.route("/follow/:id").post(vacations_1.toggleFollowVacation);
router.route("/add").post(vacations_1.addVacation);
router.route("/edit/:id").patch(vacations_1.editVacation);
router.route("/delete/:id").delete(vacations_1.deleteVacation);
router.route("/book/:id").post(vacations_1.bookVacation);
router.route("/bookedVacations").get(vacations_1.getBookedVacations);
router.route("/setBookingStatus/:id").post(vacations_1.setBookingStatus);
exports.default = router;
