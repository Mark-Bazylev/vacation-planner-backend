import express from "express";

const router = express.Router();

import { login, register } from "../controllers/auth";

router.route("/register").post(register);
router.post("/login", login);

export default router;
