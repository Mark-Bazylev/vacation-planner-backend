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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vacationsService = void 0;
const vercel_image_handler_1 = require("../../utils/vercel-image-handler");
const Vacation_1 = __importDefault(require("../../models/Vacation"));
const errors_1 = require("../../errors");
const Follower_1 = __importDefault(require("../../models/Follower"));
const not_found_1 = __importDefault(require("../../errors/not-found"));
const Booking_1 = __importStar(require("../../models/Booking"));
const PAGE_SIZE = 9;
class VacationsService {
    addVacation(newVacation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!newVacation.imageFile) {
                throw new errors_1.BadRequestError("missing Image File");
            }
            const imageName = yield (0, vercel_image_handler_1.vercelPutImage)(newVacation.imageFile);
            return yield Vacation_1.default.create(Object.assign(Object.assign({}, newVacation), { imageName }));
        });
    }
    editVacation(editedVacation) {
        return __awaiter(this, void 0, void 0, function* () {
            const { vacationId, imageFile } = editedVacation, restVacation = __rest(editedVacation, ["vacationId", "imageFile"]);
            const oldVacation = yield Vacation_1.default.findById(vacationId);
            if (!oldVacation) {
                throw new errors_1.BadRequestError("vacationId is invalid");
            }
            let existingImage = imageFile ? oldVacation.imageName : undefined;
            if (imageFile) {
                if (oldVacation.imageName)
                    yield (0, vercel_image_handler_1.vercelDeleteImage)(oldVacation.imageName);
                existingImage = yield (0, vercel_image_handler_1.vercelPutImage)(imageFile);
            }
            return yield Vacation_1.default.findByIdAndUpdate(vacationId, Object.assign(Object.assign({}, restVacation), { imageName: existingImage }), { new: true })
                .populate({ path: "followers", transform: (follower) => follower.userId })
                .exec();
        });
    }
    deleteVacation(vacationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const vacation = yield Vacation_1.default.findByIdAndDelete(vacationId).populate({
                path: "followers",
                transform: (follower) => follower.userId,
            });
            if (vacation) {
                yield (0, vercel_image_handler_1.vercelDeleteImage)(vacation.imageName);
                yield Follower_1.default.deleteMany({ vacationId: { $in: vacation.followers } });
            }
            return vacation;
        });
    }
    getVacation(vacationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Vacation_1.default.findById(vacationId)
                .populate({
                path: "followers",
                transform: (follower) => follower.userId,
            })
                .exec();
        });
    }
    getVacationsByPage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, query, }) {
            const { pageIndex, isFollowed, isCheckInNotStarted, isActiveVacation, startingDate, endingDate, } = query;
            if (!pageIndex) {
                throw new errors_1.BadRequestError("missing query params");
            }
            const offset = (+pageIndex - 1) * PAGE_SIZE;
            const queryFilter = {};
            const currentDate = Date.now();
            if (isFollowed === "true") {
                const followedVacations = yield Follower_1.default.find({ userId: userId });
                const vacationIds = followedVacations.map((follower) => follower.vacationId);
                queryFilter._id = { $in: vacationIds };
            }
            if (isCheckInNotStarted === "true") {
                queryFilter.checkIn = { $gt: currentDate };
            }
            if (isActiveVacation === "true") {
                queryFilter.checkIn = { $lt: currentDate };
                queryFilter.checkOut = { $gt: currentDate };
            }
            if (startingDate && endingDate) {
                queryFilter.checkIn = { $gte: new Date(startingDate) };
                queryFilter.checkOut = { $lte: new Date(endingDate) };
            }
            const vacations = yield Vacation_1.default.find(queryFilter)
                .populate({
                path: "followers",
                transform: (follower) => follower.userId,
            })
                .populate({
                path: "bookings",
                transform: (booking) => booking.bookingStatus === "approved"
                    ? { bookingStatus: booking.bookingStatus }
                    : undefined,
            })
                .sort({ checkIn: 1 })
                .skip(offset)
                .limit(PAGE_SIZE);
            const vacationsCount = yield Vacation_1.default.countDocuments(queryFilter);
            return { vacations, vacationsCount };
        });
    }
    toggleFollowVacation(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, vacationId, }) {
            const vacation = yield Vacation_1.default.findOne({ _id: vacationId });
            if (!vacation) {
                throw new not_found_1.default("Vacation not found");
            }
            const duplicateFollower = yield Follower_1.default.findOneAndDelete({
                vacationId,
                userId,
            });
            if (!duplicateFollower) {
                yield Follower_1.default.create({ userId, vacationId });
            }
        });
    }
    getVacationsReport() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Vacation_1.default.find()
                .populate({
                path: "followers",
                transform: (follower) => follower.userId,
            })
                .select("destination")
                .exec();
        });
    }
    bookVacation(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, vacationId }) {
            const vacation = yield Vacation_1.default.findById(vacationId);
            if (!vacation) {
                throw new errors_1.BadRequestError("Vacation not found");
            }
            const duplicateBooking = yield Booking_1.default.findOne({ vacationId, userId });
            if (duplicateBooking) {
                throw new errors_1.BadRequestError("This Booking already exists");
            }
            return yield Booking_1.default.create({ userId, vacationId });
        });
    }
    getBookedVacations(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, userRole, pageIndex, }) {
            const offset = (+pageIndex - 1) * PAGE_SIZE;
            if (userRole === "user") {
                const vacationIds = yield Booking_1.default.find({ userId }).distinct("vacationId");
                if (vacationIds.length === 0) {
                    throw new errors_1.BadRequestError("No Bookings");
                }
                return yield Vacation_1.default.find({ _id: { $in: vacationIds } })
                    .populate({
                    path: "bookings",
                    match: { userId },
                    options: { limit: 1 },
                    select: ["_id", "bookingStatus", "createdAt"],
                })
                    .exec();
            }
            else {
                const pendingVacationIds = yield Booking_1.default.find({}).distinct("vacationId");
                return yield Vacation_1.default.find({ _id: { $in: pendingVacationIds } })
                    // not the most Optimized solution
                    .populate({
                    path: "bookings",
                    select: ["_id", "bookingStatus", "userId", "createdAt"],
                    populate: {
                        path: "user",
                        select: ["_id", "firstName", "lastName"],
                    },
                })
                    .skip(offset)
                    .limit(PAGE_SIZE)
                    .exec();
            }
        });
    }
    setBookingStatus(_a) {
        return __awaiter(this, arguments, void 0, function* ({ bookingId, status }) {
            var _b;
            const booking = yield Booking_1.default.findByIdAndUpdate(bookingId, { bookingStatus: status }, { new: true });
            if (!booking) {
                throw new errors_1.BadRequestError("booking not found");
            }
            const vacation = yield Vacation_1.default.findById(booking.vacationId)
                .populate({
                path: "bookings",
                match: { bookingStatus: Booking_1.BookingStatus.approved },
                select: ["_id", "bookingStatus"],
            })
                .exec();
            if (!vacation) {
                throw new errors_1.BadRequestError("cant find vacation");
            }
            if (vacation.allocations === ((_b = vacation.bookings) === null || _b === void 0 ? void 0 : _b.length)) {
                yield Booking_1.default.updateMany({
                    vacationId: booking.vacationId,
                    bookingStatus: Booking_1.BookingStatus.pending,
                }, {
                    bookingStatus: Booking_1.BookingStatus.rejected,
                });
            }
            return booking;
        });
    }
}
exports.vacationsService = new VacationsService();
