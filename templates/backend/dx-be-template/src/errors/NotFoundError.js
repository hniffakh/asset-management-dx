import { AppError } from "./AppError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export class NotFoundError extends AppError {
  constructor(message = "Resource tidak ditemukan") {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}
