import express, { Application } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
//Security Packages
import helmet from "helmet";
import cors from "cors";
import rateLimiter from "express-rate-limit";
//middleware
import notFoundMiddleware from "./middleware/not-found";
import authenticateUser from "./middleware/authentication";
import errorHandlerMiddleware from "./middleware/error-handler";
import authRouter from "./routes/auth";
import vacationsRouter from "./routes/vacations";
import cronRouter from "./routes/cron";
import connectDB from "./db/connect";
import fileUpload from "express-fileupload";
import cronAuthentication from "./middleware/cron-authentication";
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT! || 3001;

app.set("trust proxy", 1);
app.use(cors());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  }),
);
app.use(express.json());
app.use(fileUpload());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//Static File Route
app.use("/assets", express.static("assets"));

//Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vacations", authenticateUser, vacationsRouter);
app.use("/api/v1/cron", cronAuthentication, cronRouter);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const server = createServer(app);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI!);
    server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
