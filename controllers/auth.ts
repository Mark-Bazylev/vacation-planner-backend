// import bcrypt from "bcrypt-ts";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";

interface UserRequestBody {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
}
interface UserRequest extends Request {
  body: UserRequestBody;
}
export async function register(req: UserRequest, res: Response) {
  const { email, firstName, lastName, password, role } = req.body;

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    email,
    firstName,
    lastName,
    role,
    password: hashedPassword,
  });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED as number).json({
    user: { firstName, lastName, email, role, password, hashedPassword },
    token,
  });
}

async function hashPassword(password: string) {
  // const salt = await bcrypt.genSalt(10);
  // return await bcrypt.hash(password, salt);
}
