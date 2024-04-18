import { UserDetails } from "../models/User";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";
import Unauthenticated from "../errors/unauthenticated";

interface RequestWithUser extends Request {
  user?: any;
}

export default async function authenticateUser(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  //check the header
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Unauthenticated("Authentication Invalid");
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      user: UserDetails;
    };
    req.user = payload.user;
    next();
  } catch (e) {
    next(e);
  }
}
