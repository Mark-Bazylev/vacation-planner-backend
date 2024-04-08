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
Object.defineProperty(exports, "__esModule", { value: true });
exports.vercelDeleteImage = exports.vercelPutImage = void 0;
const blob_1 = require("@vercel/blob");
const errors_1 = require("../errors");
function vercelPutImage(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!("data" in file)) {
            throw new errors_1.BadRequestError("Image is missing");
        }
        const { url } = yield (0, blob_1.put)(file.name, file.data, {
            access: "public",
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return url;
    });
}
exports.vercelPutImage = vercelPutImage;
function vercelDeleteImage(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, blob_1.del)(imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    });
}
exports.vercelDeleteImage = vercelDeleteImage;
