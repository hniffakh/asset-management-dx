import { loginService } from "../services/authService.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
import { AUTH_MESSAGES } from "../constants/authConstants.js";

/**
 * Controller: Hanya bertugas menerjemahkan HTTP request & response.
 * Tidak berisi business logic, tidak mengakses Model langsung,
 * dan hanya menggunakan req.validated yang sudah bersih.
 */
export const login = async (req, res, next) => {
  try {
    // Ambil data yang telah divalidasi dan di-sanitize oleh middleware
    const { username, password } = req.validated;

    const result = await loginService({ username, password });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
