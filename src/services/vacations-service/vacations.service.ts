import { vercelDeleteImage, vercelPutImage } from "../../utils/vercel-image-handler";
import Vacation, { VacationDocument } from "../../models/Vacation";
import { UploadedFile } from "express-fileupload";
import { BadRequestError } from "../../errors";
import Follower from "../../models/Follower";
import { FilterQuery } from "mongoose";
import NotFoundError from "../../errors/not-found";
import { StatusCodes } from "http-status-codes";

export interface VacationRequestBody {
  destination: string;
  description: string;
  checkIn: Date;
  checkOut: Date;
  price: string;
  imageName: string;
}

export interface VacationQueryParams {
  pageIndex: string;
  isFollowed: string;
  isCheckInNotStarted: string;
  isActiveVacation: string;
  [key: string]: string;
}

type VacationParams = VacationRequestBody & {
  imageFile?: UploadedFile | UploadedFile[];
  vacationId?: string;
};
class VacationsService {
  public async addVacation(newVacation: VacationParams) {
    const imageName = await vercelPutImage(newVacation.imageFile!);
    delete newVacation.imageFile;
    return await Vacation.create({
      ...newVacation,
      imageName,
    });
  }

  public async editVacation(editedVacation: VacationParams) {
    const { vacationId, imageFile, ...restVacation } = editedVacation;
    const oldVacation = await Vacation.findById(vacationId);
    if (!oldVacation) {
      throw new BadRequestError("vacationId is invalid");
    }
    let existingImage: string | undefined = imageFile ? oldVacation.imageName : undefined;
    if (existingImage) {
      await vercelDeleteImage(existingImage);
      existingImage = await vercelPutImage(imageFile!);
    }
    return await Vacation.findByIdAndUpdate(
      vacationId,
      {
        restVacation,
        imageName: existingImage,
      },
      { new: true },
    )
      .populate({ path: "followers", transform: (follower) => follower.userId })
      .exec();
  }

  public async deleteVacation(vacationId: string) {
    const vacation = await Vacation.findByIdAndDelete(vacationId).populate({
      path: "followers",
      transform: (follower) => follower.userId,
    });
    if (vacation) {
      await vercelDeleteImage(vacation.imageName);
      await Follower.deleteMany({ vacationId: { $in: vacation.followers } });
    }
    return vacation;
  }

  public async getVacation(vacationId: string) {
    return await Vacation.findById(vacationId)
      .populate({
        path: "followers",
        transform: (follower) => follower.userId,
      })
      .exec();
  }

  public async getVacationsByPage({
    userId,
    query,
  }: {
    userId: string;
    query: VacationQueryParams;
  }) {
    const { pageIndex, isFollowed, isCheckInNotStarted, isActiveVacation } = query;
    if (!pageIndex) {
      throw new BadRequestError("missing query params");
    }
    const PAGE_SIZE = 9;
    const offset = (+pageIndex - 1) * PAGE_SIZE;
    const queryFilter: FilterQuery<VacationDocument> = {};
    const currentDate = Date.now();
    if (isFollowed === "true") {
      const followedVacations = await Follower.find({ userId: userId });
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
    return { vacations, vacationsCount };
  }

  public async toggleFollowVacation({
    userId,
    vacationId,
  }: {
    userId: string;
    vacationId: string;
  }) {
    const vacation = await Vacation.findOne({ _id: vacationId });
    if (!vacation) {
      throw new NotFoundError("Vacation not found");
    }
    const duplicateFollower = await Follower.findOneAndDelete({
      vacationId,
      userId,
    });
    if (!duplicateFollower) {
      await Follower.create({ userId, vacationId });
    }
  }

  public async getVacationsReport() {
    return await Vacation.find()
      .populate({
        path: "followers",
        transform: (follower) => follower.userId,
      })
      .select("destination")
      .exec();
  }
}

export const vacationsService = new VacationsService();
