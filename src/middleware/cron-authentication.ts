import { UserDetails } from "../models/User";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";
import Unauthenticated from "../errors/unauthenticated";
import auth from "../routes/auth";

export default async function cronAuthentication(req: Request, res: Response, next: NextFunction) {
  //check the header
  try {
    const authHeader = req.headers.authorization;

    // if not found OR the bearer token does NOT equal the CRON_SECRET
    if (!authHeader || authHeader != `Bearer ${process.env.CRON_SECRET}`) {
      throw new Unauthenticated("Cron Authentication is invalid");
    }
    next();
  } catch (e) {
    next(e);
  }
}
