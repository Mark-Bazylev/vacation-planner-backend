import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { BookingDocument } from "./Booking";

export enum QuotaStatus {
  full = "full",
  available = "available",
}
export interface VacationDocument extends Document {
  destination: string;
  description: string;
  checkIn: Date;
  checkOut: Date;
  price: string;
  imageName: string;
  allocations: number;
  followers?: ObjectId[];
  bookings?: BookingDocument[];
}

const VacationSchema = new Schema<VacationDocument>(
  {
    destination: { type: String, required: [true, "Please add destination"] },
    description: { type: String, required: [true, "Please add description"] },
    checkIn: { type: Date, required: [true, "Please add check in date"] },
    checkOut: { type: Date, required: [true, "Please add check out date"] },
    price: { type: String, required: [true, "Please add in check in date"] },
    imageName: { type: String },
    allocations: { type: Number, required: [true, "Allocations are required"] },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
    virtuals: {
      followers: {
        options: {
          ref: "Follower",
          localField: "_id",
          foreignField: "vacationId",
        },
      },
      bookings: {
        options: {
          ref: "Booking",
          localField: "_id",
          foreignField: "vacationId",
        },
      },
    },
  },
);

export default mongoose.model("Vacation", VacationSchema);
