import { z } from "zod";
import { AUTH_MESSAGES } from "../constants/authConstants.js";

/**
 * Strict Zod schema for login request body
 */
export const loginSchema = z
  .object({
    username: z
      .string({ message: AUTH_MESSAGES.USERNAME_REQUIRED })
      .min(1, { message: AUTH_MESSAGES.USERNAME_REQUIRED })
      .max(50, { message: "Username maksimal 50 karakter" }),
    password: z
      .string({ message: AUTH_MESSAGES.PASSWORD_REQUIRED })
      .min(1, { message: AUTH_MESSAGES.PASSWORD_REQUIRED })
      .max(128, { message: "Password maksimal 128 karakter" }),
  })
  .strict({ message: "Payload berisi properti yang tidak diizinkan" });
