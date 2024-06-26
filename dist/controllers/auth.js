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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const auth_service_1 = require("../services/auth-service/auth.service");
function register(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user, token } = yield auth_service_1.authService.register(req.body);
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
            const { user, token } = yield auth_service_1.authService.login(req.body);
            res.status(http_status_codes_1.StatusCodes.OK).json({ user, token });
        }
        catch (e) {
            next(e);
        }
    });
}
exports.login = login;
