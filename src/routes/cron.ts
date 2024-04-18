import express from "express";

const router = express.Router();

import { bookingsCleanup } from "../controllers/vacations";

router.route("/bookingsCleanup").get(bookingsCleanup);

export default router;
