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
exports.uploadImageVacation = exports.getVacationsReport = exports.toggleFollowVacation = exports.getVacationsByPage = exports.getVacation = exports.addManyVacations = exports.deleteVacation = exports.editVacation = exports.addVacation = void 0;
const Vacation_1 = __importDefault(require("../models/Vacation"));
const http_status_codes_1 = require("http-status-codes");
const errors_1 = require("../errors");
const Follower_1 = __importDefault(require("../models/Follower"));
const not_found_1 = __importDefault(require("../errors/not-found"));
const vercel_image_handler_1 = require("../utils/vercel-image-handler");
function addVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(req.body);
            const { destination, description, checkIn, checkOut, price } = req.body;
            // if (!req.file) {
            //   throw new BadRequestError("No file uploaded");
            // }
            console.log(req.files, "and this too", req.body);
            const imageName = yield (0, vercel_image_handler_1.vercelPutImage)(req.files.imageFile);
            const vacation = yield Vacation_1.default.create({
                destination,
                description,
                checkIn,
                checkOut,
                price,
                imageName,
            });
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
            const { destination, description, checkIn, checkOut, price } = req.body;
            const oldVacation = yield Vacation_1.default.findById(vacationId);
            if (!oldVacation) {
                throw new errors_1.BadRequestError("vacationId is invalid");
            }
            console.log(oldVacation.imageName);
            let existingImage = oldVacation.imageName;
            console.log(req.files);
            if (!req.files.imageFile) {
                existingImage = undefined;
            }
            else {
                yield (0, vercel_image_handler_1.vercelDeleteImage)(oldVacation.imageName);
                existingImage = yield (0, vercel_image_handler_1.vercelPutImage)(req.files.imageFile);
            }
            const vacation = yield Vacation_1.default.findByIdAndUpdate(vacationId, {
                destination,
                description,
                checkIn,
                checkOut,
                price,
                imageName: existingImage,
            }, { new: true }).populate({ path: "followers", transform: (follower) => follower.userId });
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
            const vacation = yield Vacation_1.default.findByIdAndDelete(vacationId).populate({
                path: "followers",
                transform: (follower) => follower.userId,
            });
            if (vacation) {
                yield (0, vercel_image_handler_1.vercelDeleteImage)(vacation.imageName);
                yield Follower_1.default.deleteMany({ vacationId: { $in: vacation.followers } });
            }
            res.status(http_status_codes_1.StatusCodes.OK).json(vacation);
        }
        catch (e) {
            next(e);
        }
    });
}
exports.deleteVacation = deleteVacation;
function addManyVacations(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { vacations } = req.body;
            let createdVacation;
            const manyVacations = [];
            for (let index = 0; index < vacations.length; index++) {
                console.log(vacations[index]);
                createdVacation = yield Vacation_1.default.create(vacations[index]);
                manyVacations.push(createdVacation);
            }
            res.status(http_status_codes_1.StatusCodes.CREATED).json(manyVacations);
        }
        catch (e) {
            next(e);
        }
    });
}
exports.addManyVacations = addManyVacations;
function getVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { params: { id: vacationId }, } = req;
            const vacation = yield Vacation_1.default.findById(vacationId).populate({
                path: "followers",
                transform: (follower) => follower.userId,
            });
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
            const { user, query: { pageIndex, isFollowed, isCheckInNotStarted, isActiveVacation }, } = req;
            if (!pageIndex) {
                throw new errors_1.BadRequestError("missing query params");
            }
            const PAGE_SIZE = 9;
            const offset = (+pageIndex - 1) * PAGE_SIZE;
            const queryFilter = {};
            const currentDate = Date.now();
            if (isFollowed === "true") {
                const followedVacations = yield Follower_1.default.find({ userId: user._id });
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
            const vacations = yield Vacation_1.default.find(queryFilter)
                .populate({ path: "followers", transform: (follower) => follower.userId })
                .sort({ checkIn: 1 })
                .skip(offset)
                .limit(PAGE_SIZE);
            const vacationsCount = yield Vacation_1.default.countDocuments(queryFilter);
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
            const vacation = yield Vacation_1.default.findOne({ _id: vacationId });
            if (!vacation) {
                throw new not_found_1.default("Vacation not found");
            }
            const duplicateFollower = yield Follower_1.default.findOneAndDelete({
                vacationId,
                userId: user._id,
            });
            if (duplicateFollower !== null) {
                res.status(http_status_codes_1.StatusCodes.NO_CONTENT).send();
            }
            else {
                const follower = yield Follower_1.default.create({ userId: user._id, vacationId });
                res.status(http_status_codes_1.StatusCodes.CREATED).json({ follower });
            }
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
            const vacationsReport = yield Vacation_1.default.find()
                .populate({
                path: "followers",
                transform: (follower) => follower.userId,
            })
                .select("destination");
            res.status(http_status_codes_1.StatusCodes.OK).json(vacationsReport);
        }
        catch (e) {
            next(e);
        }
    });
}
exports.getVacationsReport = getVacationsReport;
function uploadImageVacation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            req.body.fileName;
            if (!req.file) {
                throw new errors_1.BadRequestError("No file uploaded");
            }
            // Access uploaded file details from req.file
            // Handle the file as needed, e.g., save it to the database, process it, etc.
            console.log(req);
            return res
                .status(http_status_codes_1.StatusCodes.OK)
                .json({ message: "File uploaded successfully", file: req.file });
        }
        catch (e) {
            console.log(e);
            next(e);
        }
    });
}
exports.uploadImageVacation = uploadImageVacation;
