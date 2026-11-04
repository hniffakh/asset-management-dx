import { AppError } from "./AppError.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { AUTH_MESSAGES } from "../constants/authConstants.js";

export class ValidationError extends AppError {
  constructor(message = AUTH_MESSAGES.VALIDATION_ERROR, details = null) {
    super(message, HTTP_STATUS.BAD_REQUEST, details);
  }
}
