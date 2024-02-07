import multer from "multer";
import path from "path";
import { VacationRequest } from "../controllers/vacations";
import { v4 as uuidv4, validate } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../", process.env.IMAGE_UPLOAD_PATH!)); // Destination folder for uploaded files
  },
  filename: function (req: VacationRequest, file, cb) {
    if (file) {
      const fileId = uuidv4();
      console.log("is this valid?", validate(fileId));
      const fileName = fileId + "." + file.originalname.split(".")[1];
      req.body.imageName = fileName;
      cb(null, fileName);
    }
  },
});
const multerUpload = multer({ storage: storage });
export { multerUpload };
