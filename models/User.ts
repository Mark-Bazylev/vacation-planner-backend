import mongoose, { Schema, Document, ObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface UserDetails {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

interface UserDocument extends UserDetails, Document<ObjectId> {
  // user schema fields

  // user schema methods
  createJWT: () => string; // define the createJWT method
  comparePassword: (candidatePassword: string) => Promise<boolean>; // define the createJWT method
}
export enum UserRole {
  user = "user",
  admin = "admin",
}

const UserSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: [true, "Please provide first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide last name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [emailRegex, "Please provide valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  role: {
    type: String,
    enum: {
      values: [UserRole.user, UserRole.admin],
      message: "value must be of type UserRole",
    },
    default: UserRole.user,
  },
});
UserSchema.methods.createJWT = function () {
  this.password = undefined;
  return jwt.sign(
    {
      user: this,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_LIFETIME,
    },
  );
};

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  console.log(candidatePassword, this.password);
  console.log(isMatch);
  return isMatch;
};
export default mongoose.model("User", UserSchema);
