import User from "../models/User";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface User {
  userId: string;
  name: string;
}

interface RequestWithUser extends Request {
  user?: User;
}

export default async function auth(
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) {
  //check the header
  const authHeader = req.headers.authorization;
  console.log(`auth header is ${authHeader}`);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authentication Invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string) as User;
    next();
  } catch (e) {
    throw new Error("Authentication Invalid");
  }
}
