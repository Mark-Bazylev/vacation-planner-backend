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
exports.login = exports.register = void 0;
// import bcrypt from "bcrypt-ts";
const User_1 = __importDefault(require("../models/User"));
const http_status_codes_1 = require("http-status-codes");
const bcrypt_1 = __importDefault(require("bcrypt"));
const errors_1 = require("../errors");
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, firstName, lastName, password, role } = req.body;
            if (password.length <= 4) {
                throw new errors_1.BadRequestError("Password must be at least 4 characters long");
            }
            const hashedPassword = yield hashPassword(password);
            const user = yield User_1.default.create({
                email,
                firstName,
                lastName,
                role,
                password: hashedPassword,
            });
            const token = user.createJWT();
            res.status(http_status_codes_1.StatusCodes.CREATED).json({
                user,
                token,
            });
        }
        catch (e) {
            next(e);
        }
    });
}
exports.register = register;
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield User_1.default.findOne({ email });
            const isPasswordCorrect = yield (user === null || user === void 0 ? void 0 : user.comparePassword(password));
            if (!isPasswordCorrect) {
                throw new errors_1.UnauthenticatedError("Invalid Credentials");
            }
            const token = user === null || user === void 0 ? void 0 : user.createJWT();
            res.status(http_status_codes_1.StatusCodes.OK).json({ user, token });
        }
        catch (e) {
            next(e);
        }
    });
}
exports.login = login;
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!password)
            return;
        const salt = yield bcrypt_1.default.genSalt(10);
        return yield bcrypt_1.default.hash(password, salt);
    });
}
