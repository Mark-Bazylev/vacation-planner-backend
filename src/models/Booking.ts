import mongoose, { ObjectId, Schema } from "mongoose";

export enum BookingStatus {
  approved = "approved",
  pending = "pending",
  rejected = "rejected",
}
export interface BookingDocument extends Document {
  vacationId: ObjectId;
  userId: ObjectId;
  bookingStatus: BookingStatus;
}

const BookingSchema = new Schema<BookingDocument>(
  {
    vacationId: { type: mongoose.Types.ObjectId, required: [true, "Vacation Id is missing"] },
    userId: { type: mongoose.Types.ObjectId },
    bookingStatus: {
      type: String,
      enum: [BookingStatus.approved, BookingStatus.pending, BookingStatus.rejected],
      default: BookingStatus.pending,
    },
  },
  {
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
  },
);

export default mongoose.model("Booking", BookingSchema);
