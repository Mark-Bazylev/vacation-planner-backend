import express from "express";
import {
  addVacation,
  addManyVacations,
  getVacation,
  getVacationsByPage,
  toggleFollowVacation,
  uploadImageVacation,
  editVacation,
  deleteVacation,
} from "../controllers/vacations";
import { multerUpload } from "../middleware/image-handler";

const router = express.Router();

const uploadImage = multerUpload.single("image");

router.route("/get/:id").get(getVacation);
router.route("/byPage").get(getVacationsByPage);
router.route("/follow/:id").post(toggleFollowVacation);
router.route("/add").post(uploadImage, addVacation);
router.route("/edit/:id").patch(uploadImage, editVacation);
router.route("/delete/:id").delete(deleteVacation);

router.route("/addMany").post(addManyVacations);
router.route("/upload").post(uploadImage, uploadImageVacation);

export default router;
