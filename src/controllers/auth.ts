// import bcrypt from "bcrypt-ts";
import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { BadRequestError, UnauthenticatedError } from "../errors";
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
export async function register(
  req: UserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, firstName, lastName, password, role } = req.body;
    if (password.length <= 4) {
      throw new BadRequestError("Password must be at least 4 characters long");
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      firstName,
      lastName,
      role,
      password: hashedPassword,
    });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({
      user,
      token,
    });
  } catch (e) {
    next(e);
  }
}

export async function login(
  req: UserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const isPasswordCorrect = await user?.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    const token = user?.createJWT();

    res.status(StatusCodes.OK).json({ user, token });
  } catch (e) {
    next(e);
  }
}

async function hashPassword(password: string) {
  if (!password) return;
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
