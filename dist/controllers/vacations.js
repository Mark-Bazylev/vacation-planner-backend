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
exports.getVacationsReport = exports.toggleFollowVacation = exports.getVacationsByPage = exports.getVacation = exports.deleteVacation = exports.editVacation = exports.addVacation = void 0;
const http_status_codes_1 = require("http-status-codes");
const vacations_service_1 = require("../services/vacations-service/vacations.service");
function addVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vacation = yield vacations_service_1.vacationsService.addVacation(Object.assign(Object.assign({}, req.body), { imageFile: req.files.imageFile }));
            res.status(http_status_codes_1.StatusCodes.CREATED).json({ vacation });
        }
        catch (e) {
            next(e);
        }
    });
}
exports.addVacation = addVacation;
function editVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { params: { id: vacationId }, } = req;
            const vacation = yield vacations_service_1.vacationsService.editVacation(Object.assign({ vacationId, imageFile: req.files.imageFile }, req.body));
            res.status(http_status_codes_1.StatusCodes.CREATED).json(vacation);
        }
        catch (e) {
            next(e);
        }
    });
}
exports.editVacation = editVacation;
function deleteVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { params: { id: vacationId }, } = req;
            const vacation = yield vacations_service_1.vacationsService.deleteVacation(vacationId);
            res.status(http_status_codes_1.StatusCodes.OK).json(vacation);
        }
        catch (e) {
            next(e);
        }
    });
}
exports.deleteVacation = deleteVacation;
function getVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { params: { id: vacationId }, } = req;
            const vacation = yield vacations_service_1.vacationsService.getVacation(vacationId);
            res.status(http_status_codes_1.StatusCodes.OK).json({ vacation, followers: vacation === null || vacation === void 0 ? void 0 : vacation.followers });
        }
        catch (e) {
            next(e);
        }
    });
}
exports.getVacation = getVacation;
function getVacationsByPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user, query } = req;
            const { vacations, vacationsCount } = yield vacations_service_1.vacationsService.getVacationsByPage({
                userId: user._id,
                query,
            });
            res.status(http_status_codes_1.StatusCodes.OK).json({ vacations, count: vacationsCount });
        }
        catch (e) {
            next(e);
        }
    });
}
exports.getVacationsByPage = getVacationsByPage;
function toggleFollowVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user, params: { id: vacationId }, } = req;
            yield vacations_service_1.vacationsService.toggleFollowVacation({ userId: user._id, vacationId });
            res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
        }
        catch (e) {
            next(e);
        }
    });
}
exports.toggleFollowVacation = toggleFollowVacation;
function getVacationsReport(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vacationsReport = yield vacations_service_1.vacationsService.getVacationsReport();
            res.status(http_status_codes_1.StatusCodes.OK).json(vacationsReport);
        }
        catch (e) {
            next(e);
        }
    });
}
exports.getVacationsReport = getVacationsReport;
