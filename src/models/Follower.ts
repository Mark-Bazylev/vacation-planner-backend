import mongoose, { ObjectId, Schema } from "mongoose";

export interface FollowerDocument extends Document {
  userId: ObjectId;
  vacationId: ObjectId;
}

const FollowerSchema = new Schema<FollowerDocument>({
  userId: { type: mongoose.Types.ObjectId },
  vacationId: { type: mongoose.Types.ObjectId },
});

export default mongoose.model("Follower", FollowerSchema);
