import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import {
  VacationQueryParams,
  VacationRequestBody,
  vacationsService,
} from "../services/vacations-service/vacations.service";
import { BadRequestError } from "../errors";

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
      imageFile: req.files?.imageFile,
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

export async function bookVacation(req: VacationRequest, res: Response, next: NextFunction) {
  try {
    const {
      user,
      params: { id: vacationId },
    } = req;
    const booking = await vacationsService.bookVacation({ userId: user._id, vacationId });
    res.status(StatusCodes.CREATED).json(booking);
  } catch (e) {
    next(e);
  }
}

export async function getBookedVacation(req: VacationRequest, res: Response, next: NextFunction) {
  try {
    const {
      user,
      query: { pageIndex },
    } = req;
    const booking = await vacationsService.getBookedVacations({
      userId: user._id,
      userRole: user.role,
      pageIndex,
    });
    res.status(StatusCodes.OK).json(booking);
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

export async function setBookingStatus(req: VacationRequest, res: Response, next: NextFunction) {
  try {
    const {
      params: { id: bookingId },
      body: { status },
    } = req;
    if (!status) {
      throw new BadRequestError("Status is missing");
    }
    const booking = await vacationsService.setBookingStatus({
      bookingId,
      status,
    });
    res.status(StatusCodes.OK).json({ booking });
  } catch (e) {
    next(e);
  }
}
