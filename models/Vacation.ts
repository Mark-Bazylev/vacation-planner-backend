import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface VacationDocument extends Document {
  destination: string;
  description: string;
  checkIn: Date;
  checkOut: Date;
  price: string;
  imageName: string;
  followers?: ObjectId[];
}

const VacationSchema = new Schema<VacationDocument>(
  {
    destination: { type: String, required: [true, "Please add destination"] },
    description: { type: String, required: [true, "Please add description"] },
    checkIn: { type: Date, required: [true, "Please add check in date"] },
    checkOut: { type: Date, required: [true, "Please add check out date"] },
    price: { type: String, required: [true, "Please add in check in date"] },
    imageName: { type: String, required: [true, "Please add in check in date"] },
  },
  {
    toJSON: { virtuals: true },
    id: false,
    virtuals: {
      followers: {
        options: {
          ref: "Follower",
          localField: "_id",
          foreignField: "vacationId",
        },
      },
    },
  },
);

export default mongoose.model("Vacation", VacationSchema);
