import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { authService, UserRequestBody } from "../services/auth-service/auth.service";

interface UserRequest extends Request {
  body: UserRequestBody;
}
export async function register(req: UserRequest, res: Response, next: NextFunction) {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(StatusCodes.CREATED).json({
      user,
      token,
    });
  } catch (e) {
    next(e);
  }
}

export async function login(req: UserRequest, res: Response, next: NextFunction) {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(StatusCodes.OK).json({ user, token });
  } catch (e) {
    next(e);
  }
}
