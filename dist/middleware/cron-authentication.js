"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unauthenticated_1 = __importDefault(require("../errors/unauthenticated"));
function cronAuthentication(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        //check the header
        try {
            const authHeader = req.headers.authorization;
            // if not found OR the bearer token does NOT equal the CRON_SECRET
            if (!authHeader || authHeader != `Bearer ${process.env.CRON_SECRET}`) {
                throw new unauthenticated_1.default("Cron Authentication is invalid");
            }
            next();
        }
        catch (e) {
            next(e);
        }
    });
}
exports.default = cronAuthentication;
