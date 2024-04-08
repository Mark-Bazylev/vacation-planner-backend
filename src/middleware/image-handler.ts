import multer from "multer";
import path from "path";
import { VacationRequest } from "../controllers/vacations";
import { v4 as uuidv4, validate } from "uuid";
import { put } from "@vercel/blob";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../", process.env.IMAGE_UPLOAD_PATH!)); // Destination folder for uploaded files
  },
  filename: function (req: VacationRequest, file, cb) {
    if (file) {
      const fileId = uuidv4();
      const uniqueImageName = fileId + "." + file.originalname.split(".").pop();
      req.body.imageName = uniqueImageName;

      cb(null, uniqueImageName);
    }
  },
});
const multerUpload = multer({ storage: storage });
export { multerUpload };
