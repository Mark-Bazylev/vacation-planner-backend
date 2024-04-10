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
exports.authService = void 0;
const errors_1 = require("../../errors");
const User_1 = __importDefault(require("../../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    register(registerParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, firstName, lastName, password, role } = registerParams;
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
            return { user, token };
        });
    }
    login(loginParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = loginParams;
            const user = yield User_1.default.findOne({ email });
            const isPasswordCorrect = yield (user === null || user === void 0 ? void 0 : user.comparePassword(password));
            if (!isPasswordCorrect) {
                throw new errors_1.UnauthenticatedError("Invalid Credentials");
            }
            const token = user === null || user === void 0 ? void 0 : user.createJWT();
            return { user, token };
        });
    }
}
exports.authService = new AuthService();
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!password)
            return;
        const salt = yield bcrypt_1.default.genSalt(10);
        return yield bcrypt_1.default.hash(password, salt);
    });
}
