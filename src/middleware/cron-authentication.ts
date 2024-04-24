import { NextFunction, Request, Response } from "express";
import Unauthenticated from "../errors/unauthenticated";

export default async function cronAuthentication(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader != `Bearer ${process.env.CRON_SECRET}`) {
      throw new Unauthenticated("Cron Authentication is invalid");
    }
    next();
  } catch (e) {
    next(e);
  }
}
