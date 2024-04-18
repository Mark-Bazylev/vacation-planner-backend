import { vercelDeleteImage, vercelPutImage } from "../../utils/vercel-image-handler";
import Vacation, { VacationDocument } from "../../models/Vacation";
import { UploadedFile } from "express-fileupload";
import { BadRequestError } from "../../errors";
import Follower from "../../models/Follower";
import { FilterQuery } from "mongoose";
import NotFoundError from "../../errors/not-found";
import Booking, { BookingStatus } from "../../models/Booking";

const PAGE_SIZE = 9;

export interface VacationRequestBody {
  destination: string;
  description: string;
  checkIn: Date;
  checkOut: Date;
  price: string;
  imageName: string;
  allocations: number;
  status?: string;
}

export interface VacationQueryParams {
  pageIndex: string;
  isFollowed: string;
  isCheckInNotStarted: string;
  isActiveVacation: string;
  isThisWeek: string;
  startingDate: string;
  endingDate: string;
  [key: string]: string;
}

type VacationParams = VacationRequestBody & {
  imageFile: UploadedFile | UploadedFile[] | undefined;
  vacationId?: string;
};
class VacationsService {
  public async addVacation(newVacation: VacationParams) {
    if (!newVacation.imageFile) {
      throw new BadRequestError("missing Image File");
    }
    const imageName = await vercelPutImage(newVacation.imageFile!);
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
    if (imageFile) {
      if (oldVacation.imageName) await vercelDeleteImage(oldVacation.imageName);
      existingImage = await vercelPutImage(imageFile!);
    }
    return await Vacation.findByIdAndUpdate(
      vacationId,
      {
        ...restVacation,
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
    const {
      pageIndex,
      isFollowed,
      isCheckInNotStarted,
      isActiveVacation,
      startingDate,
      endingDate,
    } = query;
    if (!pageIndex) {
      throw new BadRequestError("missing query params");
    }
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
    if (startingDate && endingDate) {
      queryFilter.checkIn = { $gte: new Date(startingDate) };
      queryFilter.checkOut = { $lte: new Date(endingDate) };
    }

    const vacations = await Vacation.find(queryFilter)
      .populate({
        path: "followers",
        transform: (follower) => follower.userId,
      })
      .populate({
        path: "bookings",
        match: { userId },
      })
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

  public async bookVacation({ userId, vacationId }: { userId: string; vacationId: string }) {
    const vacation = await Vacation.findById(vacationId);
    if (!vacation) {
      throw new BadRequestError("Vacation not found");
    }
    const duplicateBooking = await Booking.findOne({ vacationId, userId });
    if (duplicateBooking) {
      throw new BadRequestError("This Booking already exists");
    }
    return await Booking.create({ userId, vacationId });
  }

  public async getBookedVacations({
    userId,
    userRole,
    pageIndex,
  }: {
    userId: string;
    userRole: string;
    pageIndex: string;
  }) {
    const offset = (+pageIndex - 1) * PAGE_SIZE;
    let vacations, vacationsCount;
    if (userRole === "user") {
      const vacationIds = await Booking.find({ userId }).distinct("vacationId");
      if (vacationIds.length === 0) {
        throw new BadRequestError("No Bookings");
      }

      vacations = await Vacation.find({ _id: { $in: vacationIds } })
        .populate({
          path: "bookings",
          match: { userId },
          options: { limit: 1 },
          select: ["_id", "bookingStatus", "createdAt"],
        })
        .exec();

      vacationsCount = await Vacation.countDocuments({ _id: { $in: vacationIds } });
    } else {
      const pendingVacationIds = await Booking.find({}).distinct("vacationId");
      vacations = await Vacation.find({ _id: { $in: pendingVacationIds } })
        // not the most Optimized solution
        .populate({
          path: "bookings",
          select: ["_id", "bookingStatus", "userId", "createdAt"],
          populate: {
            path: "user",
            select: ["_id", "firstName", "lastName"],
          },
        })
        .skip(offset)
        .limit(PAGE_SIZE)
        .exec();

      vacationsCount = await Vacation.countDocuments({ _id: { $in: pendingVacationIds } });
    }
    return { vacations, vacationsCount };
  }

  public async setBookingStatus({ bookingId, status }: { bookingId: string; status: string }) {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { bookingStatus: status },
      { new: true },
    );
    if (!booking) {
      throw new BadRequestError("booking not found");
    }

    const vacation = await Vacation.findById(booking.vacationId)
      .populate({
        path: "bookings",
        match: { bookingStatus: BookingStatus.approved },
        select: ["_id", "bookingStatus"],
      })
      .exec();
    if (!vacation) {
      throw new BadRequestError("cant find vacation");
    }
    if (vacation.allocations === vacation.bookings?.length) {
      await Booking.updateMany(
        {
          vacationId: booking.vacationId,
          bookingStatus: BookingStatus.pending,
        },
        {
          bookingStatus: BookingStatus.rejected,
        },
      );
    }

    return booking;
  }
}

export const vacationsService = new VacationsService();
