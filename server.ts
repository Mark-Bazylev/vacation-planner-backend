import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";
import dotenv from "dotenv";
import { createServer } from "http";
//Security Packages
import helmet from "helmet";
import cors from "cors";
import rateLimiter from "express-rate-limit";
//middleware
import authenticateUser from "./middleware/authentication";
dotenv.config();
import authRouter from "./routes/auth";
const app: Application = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  }),
);

app.use(cors());
app.use(express.json());
app.use(helmet());

//Error Handler

//Routes
app.use("api/v1/auth", authRouter);
const server = createServer(app);
const start = async () => {
  try {
    server.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
