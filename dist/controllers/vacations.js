"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.bookingsCleanup = exports.setBookingStatus = exports.getVacationsReport = exports.getBookedVacation = exports.bookVacation = exports.toggleFollowVacation = exports.getVacationsByPage = exports.getVacation = exports.deleteVacation = exports.editVacation = exports.addVacation = void 0;
const http_status_codes_1 = require("http-status-codes");
const vacations_service_1 = require("../services/vacations-service/vacations.service");
const errors_1 = require("../errors");
const Booking_1 = __importStar(require("../models/Booking"));
const utils_1 = require("../utils");
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
        var _a;
        try {
            const { params: { id: vacationId }, } = req;
            const vacation = yield vacations_service_1.vacationsService.editVacation(Object.assign({ vacationId, imageFile: (_a = req.files) === null || _a === void 0 ? void 0 : _a.imageFile }, req.body));
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
function bookVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user, params: { id: vacationId }, } = req;
            const booking = yield vacations_service_1.vacationsService.bookVacation({ userId: user._id, vacationId });
            res.status(http_status_codes_1.StatusCodes.CREATED).json(booking);
        }
        catch (e) {
            next(e);
        }
    });
}
exports.bookVacation = bookVacation;
function getBookedVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { user, query: { pageIndex }, } = req;
            const { vacations, vacationsCount } = yield vacations_service_1.vacationsService.getBookedVacations({
                userId: user._id,
                userRole: user.role,
                pageIndex,
            });
            res.status(http_status_codes_1.StatusCodes.OK).json({ vacations, count: vacationsCount });
        }
        catch (e) {
            next(e);
        }
    });
}
exports.getBookedVacation = getBookedVacation;
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
function setBookingStatus(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { params: { id: bookingId }, body: { status }, } = req;
            if (!status) {
                throw new errors_1.BadRequestError("Status is missing");
            }
            const booking = yield vacations_service_1.vacationsService.setBookingStatus({
                bookingId,
                status,
            });
            res.status(http_status_codes_1.StatusCodes.OK).json({ booking });
        }
        catch (e) {
            next(e);
        }
    });
}
exports.setBookingStatus = setBookingStatus;
function bookingsCleanup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("this function ticks");
            const dates = yield Booking_1.default.find({ bookingStatus: Booking_1.BookingStatus.pending })
                .distinct("createdAt")
                .exec();
            const expiredDates = dates.filter((createdAt) => (0, utils_1.timeUntilDeadline)(new Date(createdAt)) <= 0);
            const bookings = yield Booking_1.default.updateMany({ createdAt: { $in: expiredDates } }, {
                bookingStatus: Booking_1.BookingStatus.rejected,
            });
            res.status(http_status_codes_1.StatusCodes.OK).json({ bookings });
        }
        catch (e) {
            next(e);
        }
    });
}
exports.bookingsCleanup = bookingsCleanup;
