import { AppError } from "./AppError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { AUTH_MESSAGES } from "../constants/authConstants.js";

export class UnauthorizedError extends AppError {
  constructor(message = AUTH_MESSAGES.INVALID_CREDENTIALS) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}
