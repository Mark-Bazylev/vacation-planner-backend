import { Request, Response, NextFunction } from "express";
import Vacation, { VacationDocument } from "../models/Vacation";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors";
import Follower from "../models/Follower";
import { Expression, FilterQuery } from "mongoose";
import NotFoundError from "../errors/not-found";
import { deleteImageFile } from "../utils/deleteImageFile";
import vacations from "../routes/vacations";

interface VacationRequestBody {
  destination: string;
  description: string;
  checkIn: Date;
  checkOut: Date;
  price: string;
  imageName: string;
}
interface VacationQueryParams {
  pageIndex: string;
  isFollowed: string;
  isCheckInNotStarted: string;
  isActiveVacation: string;
  [key: string]: string;
}
export interface VacationRequest extends Request {
  fileNames?: string[];
  body: VacationRequestBody;
  query: VacationQueryParams;
  user?: any;
}

export async function addVacation(req: VacationRequest, res: Response, next: NextFunction) {
  try {
    console.log(req.body);
    const { destination, description, checkIn, checkOut, price, imageName } = req.body;
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }
    const vacation = await Vacation.create({
      destination,
      description,
      checkIn,
      checkOut,
      price,
      imageName,
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
    const { destination, description, checkIn, checkOut, price, imageName } = req.body;
    let existingImage: string | undefined = imageName;
    if (!req.file) {
      existingImage = undefined;
    } else {
      const oldVacation = await Vacation.findById(vacationId);
      if (oldVacation) deleteImageFile(oldVacation.imageName);
    }
    const vacation = await Vacation.findByIdAndUpdate(
      vacationId,
      {
        destination,
        description,
        checkIn,
        checkOut,
        price,
        imageName: existingImage,
      },
      { new: true },
    ).populate({ path: "followers", transform: (follower) => follower.userId });

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

    const vacation = await Vacation.findByIdAndDelete(vacationId).populate({
      path: "followers",
      transform: (follower) => follower.userId,
    });
    if (vacation) {
      deleteImageFile(vacation.imageName);
      await Follower.deleteMany({ vacationId: { $in: vacation.followers } });
    }
    res.status(StatusCodes.OK).json(vacation);
  } catch (e) {
    next(e);
  }
}

export async function addManyVacations(req: Request, res: Response, next: NextFunction) {
  try {
    const { vacations } = req.body;
    let createdVacation;
    const manyVacations = [];
    for (let index = 0; index < vacations.length; index++) {
      console.log(vacations[index]);
      createdVacation = await Vacation.create(vacations[index]);
      manyVacations.push(createdVacation);
    }
    res.status(StatusCodes.CREATED).json(manyVacations);
  } catch (e) {
    next(e);
  }
}

export async function getVacation(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      params: { id: vacationId },
    } = req;
    const vacation = await Vacation.findById(vacationId).populate({
      path: "followers",
      transform: (follower) => follower.userId,
    });
    res.status(StatusCodes.OK).json({ vacation, followers: vacation?.followers });
  } catch (e) {
    next(e);
  }
}

export async function getVacationsByPage(req: VacationRequest, res: Response, next: NextFunction) {
  try {
    const {
      user,
      query: { pageIndex, isFollowed, isCheckInNotStarted, isActiveVacation },
    } = req;
    if (!pageIndex) {
      throw new BadRequestError("missing query params");
    }
    const PAGE_SIZE = 9;
    const offset = (+pageIndex - 1) * PAGE_SIZE;
    const queryFilter: FilterQuery<VacationDocument> = {};
    const currentDate = Date.now();
    if (isFollowed === "true") {
      const followedVacations = await Follower.find({ userId: user._id });
      const vacationIds = followedVacations.map((follower) => follower.vacationId);
      queryFilter._id = { $in: vacationIds };
    }
    if (isCheckInNotStarted === "true") {
      queryFilter.checkIn = { $gt: currentDate };
    }
    if (isActiveVacation === "true") {
      queryFilter.checkIn = { $lt: currentDate };
      queryFilter.checkOut = { $gt: currentDate };
    }
    const vacations = await Vacation.find(queryFilter)
      .populate({ path: "followers", transform: (follower) => follower.userId })
      .sort({ checkIn: 1 })
      .skip(offset)
      .limit(PAGE_SIZE);
    const vacationsCount = await Vacation.countDocuments(queryFilter);
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
    const vacation = await Vacation.findOne({ _id: vacationId });
    if (!vacation) {
      throw new NotFoundError("Vacation not found");
    }
    const duplicateFollower = await Follower.findOneAndDelete({
      vacationId,
      userId: user._id,
    });
    if (duplicateFollower !== null) {
      res.status(StatusCodes.NO_CONTENT).send();
    } else {
      const follower = await Follower.create({ userId: user._id, vacationId });
      res.status(StatusCodes.CREATED).json({ follower });
    }
  } catch (e) {
    next(e);
  }
}

export async function getVacationsReport(req: Request, res: Response, next: NextFunction) {
  try {
    const vacationsReport = await Vacation.find()
      .populate({
        path: "followers",
        transform: (follower) => follower.userId,
      })
      .select("destination");
    res.status(StatusCodes.OK).json(vacationsReport);
  } catch (e) {
    next(e);
  }
}

export async function uploadImageVacation(req: Request, res: Response, next: NextFunction) {
  try {
    req.body.fileName;
    if (!req.file) {
      throw new BadRequestError("No file uploaded");
    }
    // Access uploaded file details from req.file
    // Handle the file as needed, e.g., save it to the database, process it, etc.
    console.log(req);
    return res
      .status(StatusCodes.OK)
      .json({ message: "File uploaded successfully", file: req.file });
  } catch (e) {
    console.log(e);
    next(e);
  }
}
