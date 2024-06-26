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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["approved"] = "approved";
    BookingStatus["pending"] = "pending";
    BookingStatus["rejected"] = "rejected";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
const BookingSchema = new mongoose_1.Schema({
    vacationId: { type: mongoose_1.default.Types.ObjectId, required: [true, "Vacation Id is missing"] },
    userId: { type: mongoose_1.default.Types.ObjectId },
    bookingStatus: {
        type: String,
        enum: [BookingStatus.approved, BookingStatus.pending, BookingStatus.rejected],
        default: BookingStatus.pending,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    timestamps: true,
    virtuals: {
        user: {
            options: {
                ref: "User",
                localField: "userId",
                foreignField: "_id",
                justOne: true,
            },
        },
    },
});
exports.default = mongoose_1.default.model("Booking", BookingSchema);
