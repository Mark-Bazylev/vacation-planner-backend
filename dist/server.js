"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
//Security Packages
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
//middleware
const not_found_1 = __importDefault(require("./middleware/not-found"));
const authentication_1 = __importDefault(require("./middleware/authentication"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const auth_1 = __importDefault(require("./routes/auth"));
const vacations_1 = __importDefault(require("./routes/vacations"));
const connect_1 = __importDefault(require("./db/connect"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.set("trust proxy", 1);
app.use((0, cors_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
}));
app.use(express_1.default.json());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
//Static File Route
app.use("/assets", express_1.default.static("assets"));
//Routes
app.get("/test", (req, res, next) => {
    return res.send("Welcome to the backend :)");
});
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/vacations", authentication_1.default, vacations_1.default);
app.use(error_handler_1.default);
app.use(not_found_1.default);
const server = (0, http_1.createServer)(app);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.default)(process.env.MONGO_URI);
        server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
        console.log(path_1.default.join(__dirname, "../", process.env.IMAGE_UPLOAD_PATH, "hi"));
    }
    catch (error) {
        console.log(error);
    }
});
start();
