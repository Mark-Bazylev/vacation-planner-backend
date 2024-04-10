import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import {
  VacationQueryParams,
  VacationRequestBody,
  vacationsService,
} from "../services/vacations-service/vacations.service";

export interface VacationRequest extends Request {
  fileNames?: string[];
  body: VacationRequestBody;
  query: VacationQueryParams;
  user?: any;
}

export async function addVacation(req: VacationRequest, res: Response, next: NextFunction) {
  try {
    const vacation = await vacationsService.addVacation({
      ...req.body,
      imageFile: req.files!.imageFile,
    });
    res.status(StatusCodes.CREATED).json({ vacation });
  } catch (e) {
    next(e);
  }
}

export async function editVacation(req: VacationRequest, res: Response, next: NextFunction) {
  try {
    const {
      params: { id: vacationId },
    } = req;
    const vacation = await vacationsService.editVacation({
      vacationId,
      imageFile: req.files!.imageFile,
      ...req.body,
    });
    res.status(StatusCodes.CREATED).json(vacation);
  } catch (e) {
    next(e);
  }
}

export async function deleteVacation(req: VacationRequest, res: Response, next: NextFunction) {
  try {
    const {
      params: { id: vacationId },
    } = req;

    const vacation = await vacationsService.deleteVacation(vacationId);
    res.status(StatusCodes.OK).json(vacation);
  } catch (e) {
    next(e);
  }
}

export async function getVacation(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      params: { id: vacationId },
    } = req;
    const vacation = await vacationsService.getVacation(vacationId);
    res.status(StatusCodes.OK).json({ vacation, followers: vacation?.followers });
  } catch (e) {
    next(e);
  }
}

export async function getVacationsByPage(req: VacationRequest, res: Response, next: NextFunction) {
  try {
    const { user, query } = req;
    const { vacations, vacationsCount } = await vacationsService.getVacationsByPage({
      userId: user._id,
      query,
    });
    res.status(StatusCodes.OK).json({ vacations, count: vacationsCount });
  } catch (e) {
    next(e);
  }
}

export async function toggleFollowVacation(
  req: VacationRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      user,
      params: { id: vacationId },
    } = req;
    await vacationsService.toggleFollowVacation({ userId: user._id, vacationId });
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (e) {
    next(e);
  }
}

export async function getVacationsReport(req: Request, res: Response, next: NextFunction) {
  try {
    const vacationsReport = await vacationsService.getVacationsReport();
    res.status(StatusCodes.OK).json(vacationsReport);
  } catch (e) {
    next(e);
  }
}
