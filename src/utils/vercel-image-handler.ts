import { del, put } from "@vercel/blob";
import { UploadedFile } from "express-fileupload";
import { BadRequestError } from "../errors";
export interface FileTypes extends UploadedFile {
  data: Buffer;
  name: string;
}
export async function vercelPutImage(file: FileTypes | UploadedFile[]) {
  if (!("data" in file)) {
    throw new BadRequestError("Image is missing");
  }
  const { url } = await put(file.name, file.data, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return url;
}

export async function vercelDeleteImage(imageUrl: string) {
  await del(imageUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
}
