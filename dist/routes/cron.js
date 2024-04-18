"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const vacations_1 = require("../controllers/vacations");
router.route("/bookingsCleanup").get(vacations_1.bookingsCleanup);
exports.default = router;
